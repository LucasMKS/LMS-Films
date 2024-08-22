import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../service/AuthService";
import bgImagem from "../../assets/background-image.png";
import Box from '@mui/material/Box';
import { Button, TextField, Alert } from '@mui/material';

// Constantes
const INITIAL_LOGIN_DATA = { email: "", password: "" };
const INITIAL_USER_DATA = { name: "", nickname: "", email: "", password: "" };
const ERROR_TIMEOUT = 5000;
const ROUTES = {
  LIST: "/search",
};
const LOCAL_STORAGE_KEYS = {
  TOKEN: "token",
  ROLE: "role",
  NICKNAME: "nickname",
};

export default function LoginPage({ onLogin }) {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState(INITIAL_LOGIN_DATA);
  const [userData, setUserData] = useState(INITIAL_USER_DATA);
  const [isLogin, setIsLogin] = useState(true);

  const handleInputChange = (e, isLoginForm = true) => {
    const { name, value } = e.target;
    if (isLoginForm) {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { email, password } = loginData;
      const userData = await AuthService.login(email, password);

      if (userData.token) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, userData.token);
        localStorage.setItem(LOCAL_STORAGE_KEYS.ROLE, userData.role);
        localStorage.setItem(LOCAL_STORAGE_KEYS.NICKNAME, userData.nickname);
        onLogin();
        navigate(ROUTES.LIST);
      } else {
        setError(userData.mensagem);
      }
    } catch (error) {
      setError(error.response?.data?.mensagem || "Erro ao fazer login");
      setTimeout(() => {
        setError("");
      }, ERROR_TIMEOUT);
    }
  };

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await AuthService.register(userData);
      if (res.statusCode === 200) {
        setUserData(INITIAL_USER_DATA);
        setIsLogin(true);
      } else {
        setError(res.mensagem);
      }
    } catch (error) {
      setError(error.response?.data?.mensagem || "Erro ao cadastrar");
      setTimeout(() => {
        setError("");
      }, ERROR_TIMEOUT);
    }
  };

  return (
    <Box className="relative h-screen w-screen bg-blue-950 bg-opacity-50 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgImagem})`,
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center">=
        <div className="p-6 rounded-3xl bg-black bg-opacity-10 w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            {isLogin ? "Login" : "Cadastro"}
          </h2>
          {error && (
            <div className=" rounded-md relative mb-4" role="alert">
              <Alert variant="filled" severity="error">
                {error}
              </Alert>
            </div>
          )}
          <form onSubmit={isLogin ? submitLogin : handleNewSubmit}>
            {!isLogin && (
              <div className="mb-6">
                <TextField
                  variant="filled"
                  id="name"
                  name="name" // Adicione isso
                  label="Nome"
                  value={userData.name}
                  onChange={(e) => handleInputChange(e, false)}
                  className="rounded-lg w-full bg-white"
                  required
                />
                <TextField
                  variant="filled"
                  id="nickname"
                  name="nickname" // Adicione isso
                  label="Username"
                  value={userData.nickname}
                  onChange={(e) => handleInputChange(e, false)}
                  className="rounded-lg w-full bg-white"
                  required
                />
              </div>

            )}
            <div className="mb-6">
              <TextField
                variant="filled"
                id="email"
                name="email"
                label="Email"
                type="email"
                value={isLogin ? loginData.email : userData.email}
                onChange={(e) => handleInputChange(e, isLogin)}
                className="rounded-lg w-full bg-white"
                required
              />
            </div>
            <div className="mb-10">
              <TextField
                variant="filled"
                id="password"
                name="password"
                label="Senha"
                type="password"
                value={isLogin ? loginData.password : userData.password}
                onChange={(e) => handleInputChange(e, isLogin)}
                className="rounded-lg w-full bg-white"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <Button
                type="submit"
                className="bg-dark-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {isLogin ? "Entrar" : "Cadastrar"}
              </Button >
              <Button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="inline-block align-baseline font-bold text-sm text-dark-blue hover:text-blue-800"
              >
                {isLogin ? "Criar conta" : "Já tenho uma conta"}
              </Button >
            </div>
          </form>
        </div>
      </div>
    </Box>
  );
}