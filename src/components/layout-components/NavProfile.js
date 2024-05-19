import React from "react";
import { Dropdown, Avatar } from "antd";
import { useDispatch } from "react-redux";
import {
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import NavItem from "./NavItem";
import Flex from "components/shared-components/Flex";
import { signOut } from "store/slices/authSlice";
import styled from "@emotion/styled";
import {
  FONT_WEIGHT,
  MEDIA_QUERIES,
  SPACER,
  FONT_SIZES,
} from "constants/ThemeConstant";
import { Link } from "react-router-dom";

const Icon = styled.div(() => ({
  fontSize: FONT_SIZES.LG,
}));

const Profile = styled.div(() => ({
  display: "flex",
  alignItems: "center",
}));

const UserInfo = styled("div")`
  padding-left: ${SPACER[2]};

  @media ${MEDIA_QUERIES.MOBILE} {
    display: none;
  }
`;

const Name = styled.div(() => ({
  fontWeight: FONT_WEIGHT.SEMIBOLD,
}));

const Title = styled.span(() => ({
  opacity: 0.8,
}));

const MenuItem = (props) => (
  <Link to={props.path} relative="path">
    <Flex alignItems="center" gap={SPACER[2]}>
      <Icon>{props.icon}</Icon>
      <span>{props.label}</span>
    </Flex>
  </Link>
);

const MenuItemSignOut = (props) => {
  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <div onClick={handleSignOut}>
      <Flex alignItems="center" gap={SPACER[2]}>
        <Icon>
          <LogoutOutlined />
        </Icon>
        <span>{props.label}</span>
      </Flex>
    </div>
  );
};

const items = [
  {
    key: "meusDados",
    label: (
      <MenuItem
        path="/app/config/editar-perfil"
        label="Meus dados"
        icon={<UserOutlined />}
      />
    ),
  },
  {
    key: "Sair",
    label: <MenuItemSignOut label="Sair" />,
  },
];

export const NavProfile = ({ mode, perfil }) => {
  return (
    <Dropdown placement="bottomRight" menu={{ items }} trigger={["click"]}>
      <NavItem mode={mode}>
        <Profile>
          <Avatar
            size={50}
            src={perfil?.urlImagemPerfil}
          >{`${perfil?.nome?.substr(0, 1)}${
            perfil?.sobrenome?.substr(0, 1) || ""
          }`}</Avatar>
          <UserInfo className="profile-text">
            <Name>{`${perfil.nome}`}</Name>
            <Title>{`${perfil?.descricao || perfil?.sobrenome || ""}`}</Title>
          </UserInfo>
        </Profile>
      </NavItem>
    </Dropdown>
  );
};

export default NavProfile;
