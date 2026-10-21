package com.conectaco.conectaco.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class CarlosController {

    @GetMapping("/carlos")
    public String carlos(){
        return "Hola desde el endpoint de Carlos";
    }
}
