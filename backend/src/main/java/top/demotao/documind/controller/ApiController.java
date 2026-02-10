package top.demotao.documind.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import top.demotao.documind.common.Result;

import java.util.Map;

@RestController
@RequestMapping("/ai")
public class ApiController {

    @Value("${ai-engine.url}")
    private String aiEngineUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/test")
    public Result<Object> testAi(@RequestBody Map<String, Object> body) {
        String url = aiEngineUrl + "/api/ai/test";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        
        try {
            // 转发请求到 AI Engine
            Map response = restTemplate.postForObject(url, request, Map.class);
            return Result.success(response.get("data"));
        } catch (Exception e) {
            return Result.error("AI 服务调用失败: " + e.getMessage());
        }
    }
}
