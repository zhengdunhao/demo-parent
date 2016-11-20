package com.test.login.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/userLoginController")
public class UserLoginController {

	@RequestMapping(value="/user/forwardUserLogin")
	public ModelAndView forwardUserLogin(HttpServletRequest request,HttpServletResponse response){
		ModelAndView mv = new ModelAndView("login/welcome");
		return mv;
	}
	
	@RequestMapping(value="/companyLogin")
	public ModelAndView companyLogin(HttpServletRequest request,HttpServletResponse response){
		ModelAndView mv = new ModelAndView("login/companyLogin");
		return mv;
	}
}
