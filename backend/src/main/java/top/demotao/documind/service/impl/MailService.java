package top.demotao.documind.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Value("${spring.mail.username}")
    private String from;

    /**
     * 发送验证码
     * @param to 收件人邮箱
     * @return 验证码
     */
    public String sendVerificationCode(String to) {
        String code = String.valueOf(new Random().nextInt(899999) + 100000);
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject("DocuMind AI 注册验证码");
        message.setText("您的验证码是：" + code + "，有效期5分钟。请勿泄露给他人。");
        
        mailSender.send(message);

        // 存入 Redis，5分钟过期
        redisTemplate.opsForValue().set("verify:code:" + to, code, 5, TimeUnit.MINUTES);
        
        return code;
    }

    /**
     * 校验验证码
     */
    public boolean verifyCode(String email, String code) {
        String storedCode = redisTemplate.opsForValue().get("verify:code:" + email);
        return code.equals(storedCode);
    }
}
