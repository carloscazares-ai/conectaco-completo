package com.conectaco.conectaco.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class YaretziController {

    @GetMapping("/yaretzi")
    public String yaretzi(){
        return "Hola desde el endpoint de Yaretzi";
    }
}
