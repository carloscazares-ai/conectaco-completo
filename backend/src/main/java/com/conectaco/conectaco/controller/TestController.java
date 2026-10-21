package com.conectaco.conectaco.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {

    @GetMapping("/hola")
    public String test(){
        System.out.println("Ejecutando hola");
        return "hola desde springboot";
    }
}
