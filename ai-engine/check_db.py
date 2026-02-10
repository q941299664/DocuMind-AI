import psycopg2
from psycopg2 import sql
import os
from dotenv import load_dotenv

# 加载 .env
load_dotenv()

# 从环境变量获取配置
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("Error: DATABASE_URL not found in .env")
    exit(1)

# 解析 DATABASE_URL (简单解析)
# 格式: postgresql://username:password@localhost:5432/database_name
try:
    # 去掉前缀
    url_part = DATABASE_URL.replace("postgresql://", "")
    auth_part, rest = url_part.split("@")
    user_pass, _ = auth_part.split(":") # 这里简单处理，如果密码里有:会出问题，但用于脚本够了
    username = user_pass
    password = _.split(":")[0] if ":" in _ else _ # 修正
    
    # 更稳妥的解析方式是用 urllib
    from urllib.parse import urlparse
    result = urlparse(DATABASE_URL)
    username = result.username
    password = result.password
    hostname = result.hostname
    port = result.port
    dbname = result.path.lstrip('/')
except Exception as e:
    print(f"Error parsing DATABASE_URL: {e}")
    exit(1)

DEFAULT_DB = "postgres"

def init_db():
    print(f"Checking database connection...")
    print(f"URL: postgresql://{username}:****@{hostname}:{port}/{dbname}")
    
    try:
        # 1. 尝试连接默认数据库 (postgres) 来检查目标库是否存在
        # 这一步是为了应对目标库不存在的情况
        conn = psycopg2.connect(
            host=hostname,
            port=port,
            user=username,
            password=password,
            dbname=DEFAULT_DB
        )
        conn.autocommit = True
        cursor = conn.cursor()
        print(f"Successfully connected to '{DEFAULT_DB}' database.")

        # 2. 检查目标数据库是否存在
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (dbname,))
        exists = cursor.fetchone()

        if not exists:
            print(f"Target database '{dbname}' does not exist. Creating...")
            cursor.execute(sql.SQL("CREATE DATABASE {}").format(
                sql.Identifier(dbname)
            ))
            print(f"Database '{dbname}' created successfully.")
        else:
            print(f"Target database '{dbname}' already exists.")

        cursor.close()
        conn.close()
        return True

    except Exception as e:
        print("\n[Connection Failed]")
        # 尝试解码错误信息
        try:
            msg = str(e)
            print(msg)
        except:
            print("An error occurred but the message could not be decoded.")
        return False

if __name__ == "__main__":
    if init_db():
        print("\nDatabase is ready. You can now run migrations.")
    else:
        print("\nDatabase setup failed. Please check your username/password in .env")
