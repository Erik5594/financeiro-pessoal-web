import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Alert } from "antd";
import { signUp, showAuthMessage, showLoading, hideAuthMessage } from 'store/slices/authSlice';
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion"

const rules = {
	email: [
		{ 
			required: true,
			message: 'Informe seu email!'
		},
		{ 
			type: 'email',
			message: 'Email inválido!'
		}
	],
	nome: [
		{ 
			required: true,
			message: 'Informe um nome!'
		}
	],
	username: [
		{ 
			required: true,
			message: 'Informe um username!'
		}
	],
	password: [
		{ 
			required: true,
			message: 'Informe uma senha!'
		}
	],
	confirm: [
		{ 
			required: true,
			message: 'Confirme seu email!'
		},
		({ getFieldValue }) => ({
			validator(_, value) {
				if (!value || getFieldValue('password') === value) {
					return Promise.resolve();
				}
				return Promise.reject('As senhas não combinam!');
			},
		})
	]
}

export const RegisterForm = (props) => {

	const { signUp, showLoading, token, loading, redirect, message, showMessage, hideAuthMessage, allowRedirect = true } = props
	const [form] = Form.useForm();

	const navigate = useNavigate();

	const onSignUp = () => {
    	form.validateFields().then(values => {
			showLoading()
			signUp(values)
		}).catch(info => {
			console.log('Validate Failed:', info);
		});
	}

	useEffect(() => {
		if (token !== null && allowRedirect) {
			navigate(redirect)
		}
		if (showMessage) {
			const timer = setTimeout(() => hideAuthMessage(), 3000)
			return () => {
				clearTimeout(timer);
			};
		}
	});
	
	return (
		<>
			<motion.div 
				initial={{ opacity: 0, marginBottom: 0 }} 
				animate={{ 
					opacity: showMessage ? 1 : 0,
					marginBottom: showMessage ? 20 : 0 
				}}> 
				<Alert type="error" showIcon message={message}></Alert>
			</motion.div>
			<Form form={form} layout="vertical" name="register-form" onFinish={onSignUp}>
				<Form.Item 
					name="nome" 
					label="Primeiro Nome" 
					rules={rules.nome}
					hasFeedback
				>
					<Input prefix={<UserOutlined className="text-primary" />}/>
				</Form.Item>
				<Form.Item 
					name="username" 
					label="Username" 
					rules={rules.username}
					hasFeedback
				>
					<Input prefix={<UserOutlined className="text-primary" />}/>
				</Form.Item>
				<Form.Item 
					name="email" 
					label="Email" 
					rules={rules.email}
					hasFeedback
				>
					<Input prefix={<MailOutlined className="text-primary" />}/>
				</Form.Item>
				<Form.Item 
					name="password" 
					label="Senha" 
					rules={rules.password}
					hasFeedback
				>
					<Input.Password prefix={<LockOutlined className="text-primary" />}/>
				</Form.Item>
				<Form.Item 
					name="confirm" 
					label="Confirme a senha" 
					rules={rules.confirm}
					hasFeedback
				>
					<Input.Password prefix={<LockOutlined className="text-primary" />}/>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" block loading={loading}>
						Cadastrar
					</Button>
				</Form.Item>
			</Form>
		</>
	)
}

const mapStateToProps = ({auth}) => {
	const { loading, message, showMessage, token, redirect } = auth;
  return { loading, message, showMessage, token, redirect }
}

const mapDispatchToProps = {
	signUp,
	showAuthMessage,
	hideAuthMessage,
	showLoading
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm)
