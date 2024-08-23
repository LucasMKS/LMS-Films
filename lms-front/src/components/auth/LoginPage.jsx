import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../service/AuthService";
import bgImagem from "../../assets/LMS-BG.png";

import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { ButtonGroup } from 'primereact/buttongroup';
import { Message } from 'primereact/message';

// Constantes
const INITIAL_LOGIN_DATA = { email: "", password: "" };
const INITIAL_USER_DATA = { name: "", nickname: "", email: "", password: "" };
const TIMEOUT = 3000;
const ROUTES = {
  SEARCH: "/search",
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
  const [message, setMessage] = useState("");

  const handleInputChange = (e, isLoginForm = true) => {
    const { name, value } = e.target;
    if (isLoginForm) {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const TimeoutError = () => {
    setTimeout(() => {
      setError("");
    }, TIMEOUT);
  };
  
  const TimeoutMessage = () => {
    setTimeout(() => {
      setMessage("");
    }, TIMEOUT);
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
        navigate(ROUTES.SEARCH);
        setMessage(userData.message);
        TimeoutMessage();
      } else {
        setError(userData.error);
        TimeoutError();
      }
    } catch (error) {
      setError(error.response?.data?.error || "Erro ao fazer login");
      TimeoutError();
    }
  };

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await AuthService.register(userData);
      if (res.statusCode === 200) {
        setUserData(INITIAL_USER_DATA);
        setIsLogin(true);
        setMessage(res.message);
        TimeoutMessage();
      } else {
        setError(res.error);
        TimeoutError();
      }
    } catch (error) {
      setError(error.response?.data?.mensagem || "Erro ao cadastrar");
      TimeoutError();
    }

  };

  return (
    <div className="h-screen w-screen bg-blue-950 bg-opacity-50 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgImagem})`,
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="w-full h-full flex items-center justify-center">=
        <div className="p-6 rounded-3xl bg-black bg-opacity-20 w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            {isLogin ? "Login" : "Cadastro"}
          </h2>
          {error && (
            <div className="card flex flex-wrap align-items-center justify-center mb-2">
            <Message className="w-5/6" severity="error" text={error} />
        </div>
          )}
          {message && (
            <div className="card flex flex-wrap align-items-center justify-center mb-2">
            <Message className="w-5/6" severity="success" text={message} />
        </div>
          )}
          <form onSubmit={isLogin ? submitLogin : handleNewSubmit}>
            <div className="items-center justify-center content-center">
              {!isLogin && (
                <div>
                  <div className="card flex justify-center mb-4">
                    <InputText id="name" placeholder="Nome" name="name" className="w-5/6" required value={userData.name} onChange={(e) => handleInputChange(e, false)} />
                  </div>

                  <div className="card flex justify-center mb-4">
                    <InputText id="nickname" placeholder="Username" name="nickname" className="w-5/6" required value={userData.nickname} onChange={(e) => handleInputChange(e, false)} />
                  </div>
                </div>

              )}
              <div className="card flex justify-center mb-4">
                <InputText id="email" type="email" placeholder="Email" name="email" className="w-5/6" required value={isLogin ? loginData.email : userData.email} onChange={(e) => handleInputChange(e, isLogin)} />
              </div>

              <div className="card flex justify-center mb-4">
                <Password id="password" placeholder="Senha" name="password" required toggleMask feedback={!isLogin ? true : false} value={isLogin ? loginData.password : userData.password} onChange={(e) => handleInputChange(e, isLogin)}
                  promptLabel="Defina uma senha" weakLabel="Muito Simples" mediumLabel="Complexidade média" strongLabel="Senha complexa" />
              </div>


              <div className="card flex justify-center w-full">
                <ButtonGroup>
                  <Button type="submit" raised className="w-36 justify-center" >{isLogin ? "Entrar" : "Cadastrar"}</Button >
                  <Button type="button" severity="secondary" raised className="w-36 justify-center" onClick={() => setIsLogin(!isLogin)} >{isLogin ? "Criar conta" : "Logar"}</Button >
                </ButtonGroup>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}