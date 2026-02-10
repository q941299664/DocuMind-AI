package top.demotao.documind.service.impl;

import top.demotao.documind.entity.Users;
import top.demotao.documind.mapper.UsersMapper;
import top.demotao.documind.service.IUsersService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 用户表 服务实现类
 * </p>
 *
 * @author TraeAI
 * @since 2026-02-10
 */
@Service
public class UsersServiceImpl extends ServiceImpl<UsersMapper, Users> implements IUsersService {

}
