import React, { useState } from "react";
import { Dropdown, Avatar, Drawer, Space, Button } from "antd";
import { useDispatch } from "react-redux";
import {
  EditOutlined,
  SettingOutlined,
  ShopOutlined,
  GoldOutlined,
  LogoutOutlined,
  DollarOutlined,
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
import MetodosPagamento from "views/app-views/metodo-pagamento/MetodoPagamento";

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

const MenuItemMetodosPagamento = (props) => {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
        placement={"right"}
        width={450}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose} size="small">
              Cancelar
            </Button>
            <Button
              className="mr-2"
              size="small"
              type="primary"
              onClick={showModal}
            >
              Novo
            </Button>
          </Space>
        }
      >
        <MetodosPagamento
          handleCancel={handleCancel}
          isModalOpen={isModalOpen}
        />
      </Drawer>
    </div>
  );
};

const MenuItem = (props) => (
  <Flex as="a" href={props.path} alignItems="center" gap={SPACER[2]}>
    <Icon>{props.icon}</Icon>
    <span>{props.label}</span>
  </Flex>
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
    key: "Métodos pagamentos",
    label: (
      <MenuItemMetodosPagamento
        label="Metodos pagamento"
        icon={<DollarOutlined />}
      />
    ),
  },
  {
    key: "Categorias",
    label: (
      <MenuItem
        path="/app/categoria"
        label="Categorias"
        icon={<GoldOutlined />}
      />
    ),
  },
  {
    key: "Sair",
    label: <MenuItemSignOut label="Sair" />,
  },
];

export const NavProfile = ({ mode }) => {
  return (
    <Dropdown placement="bottomRight" menu={{ items }} trigger={["click"]}>
      <NavItem mode={mode}>
        <Profile>
          <Avatar src="https://as2.ftcdn.net/v2/jpg/05/34/51/79/1000_F_534517941_p4ow2RcqXpcLsh3RBftkD4RcBO8N5rEs.webp" />
          <UserInfo className="profile-text">
            <Name>Erik Queiroz</Name>
            <Title>Desenvolvedor Fullstack</Title>
          </UserInfo>
        </Profile>
      </NavItem>
    </Dropdown>
  );
};

export default NavProfile;
