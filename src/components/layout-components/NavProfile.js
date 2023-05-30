import React, { useState } from 'react';
import { Dropdown, Avatar, Drawer } from 'antd';
import { useDispatch } from 'react-redux'
import { 
	EditOutlined, 
	SettingOutlined, 
	ShopOutlined, 
	QuestionCircleOutlined, 
	LogoutOutlined ,
	DollarOutlined
} from '@ant-design/icons';
import NavItem from './NavItem';
import Flex from 'components/shared-components/Flex';
import { signOut } from 'store/slices/authSlice';
import styled from '@emotion/styled';
import { FONT_WEIGHT, MEDIA_QUERIES, SPACER, FONT_SIZES } from 'constants/ThemeConstant'
import MetodosPagamento from 'views/app-views/metodo-pagamento/MetodoPagamento';



const Icon = styled.div(() => ({
	fontSize: FONT_SIZES.LG
}))

const Profile = styled.div(() => ({
	display: 'flex',
	alignItems: 'center'
}))

const UserInfo = styled('div')`
	padding-left: ${SPACER[2]};

	@media ${MEDIA_QUERIES.MOBILE} {
		display: none
	}
`

const Name = styled.div(() => ({
	fontWeight: FONT_WEIGHT.SEMIBOLD
}))

const Title = styled.span(() => ({
	opacity: 0.8
}))

const MenuItemMetodosPagamento = (props) => {
	const [open, setOpen] = useState(false);

	const showDrawer = () => {
		setOpen(true);
	};
	
	const onClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<div onClick={showDrawer}>
				<Flex alignItems="center" gap={SPACER[2]}>
					<Icon>{props.icon}</Icon>
					<span>{props.label}</span>
				</Flex>
			</div>
			<Drawer
				title="Métodos de pagamento"
				placement={'right'} 
				width={450}
				onClose={onClose}
				open={open}
			>
				<MetodosPagamento/>
			</Drawer>
		
		</div>
	)
}

// const MenuItem = (props) => (
// 	<Flex as="a" href={props.path} alignItems="center" gap={SPACER[2]}>
// 		<Icon>{props.icon}</Icon>
// 		<span>{props.label}</span>
// 	</Flex>
//)

const MenuItemSignOut = (props) => {

	const dispatch = useDispatch();

	const handleSignOut = () => {
		dispatch(signOut())
	}

	return (
		<div onClick={handleSignOut}>
			<Flex alignItems="center" gap={SPACER[2]} >
				<Icon>
					<LogoutOutlined />
				</Icon>
				<span>{props.label}</span>
			</Flex>
		</div>
	)
}

const items = [
	{
		key: 'Métodos pagamentos',
		label: <MenuItemMetodosPagamento label="Metodos pagamento" icon={<DollarOutlined/>}/>
	},
	{
		key: 'Sair',
		label: <MenuItemSignOut label="Sair" />,
	}
]

export const NavProfile = ({mode}) => {
	return (
		<Dropdown placement="bottomRight" menu={{items}} trigger={["click"]}>
			<NavItem mode={mode}>
				<Profile>
					<Avatar src="/img/avatars/thumb-1.jpg" />
					<UserInfo className="profile-text">
						<Name>Erik Queiroz</Name>
						<Title>Desenvolvedor Fullstack</Title>
					</UserInfo>
				</Profile>
			</NavItem>
		</Dropdown>
	);
}

export default NavProfile