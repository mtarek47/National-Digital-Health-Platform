package com.dghs.healthcard.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI healthCardOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("National Digital Health Card API")
                        .description("Centralized, Secure & Interoperable Healthcare Record Platform for Bangladesh")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("DGHS Shared Health Record Interoperability Initiative")
                                .url("https://dghs.gov.bd")));
    }
}
