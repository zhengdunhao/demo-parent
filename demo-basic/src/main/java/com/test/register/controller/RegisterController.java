package com.test.register.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/userRegisterController")
public class RegisterController {
	@RequestMapping(value="/register")
	public ModelAndView forwardUserLogin(HttpServletRequest request,HttpServletResponse response){
		ModelAndView mv = new ModelAndView("register/register");
		return mv;
	}
}
