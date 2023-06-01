import { Button, Collapse, Empty, Form, Tree, Input } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { buscarTree } from "store/slices/categoriaSlice";
import { DownOutlined } from "@ant-design/icons";
import CategoriaCadastroModal from "./CategoriaCadastroModal";

const { Panel } = Collapse;
const { Search } = Input;

const dataListReceita = [];
const dataListDespesa = [];

export const Categoria = (props) => {
  const { buscarTree, categoriaTree } = props;
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipo, setTipo] = useState("receita");
  const [state, setState] = useState({
    despesa: {
      expandedKeys: [],
      searchValue: "",
      autoExpandParent: true,
    },
    receita: {
      expandedKeys: [],
      searchValue: "",
      autoExpandParent: true,
    },
  });

  const generateLists = () => {
    generateListReceita(categoriaTree.receitas);
    generateListDespesa(categoriaTree.despesas);
  };

  const fetchCategoria = () => {
    buscarTree();
  };

  useEffect(() => {
    fetchCategoria();
  }, []);

  const novaCategoria = (tipo) => {
    setTipo(tipo);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    console.log("OnFinish....", values);
  };

  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  const generateListReceita = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key } = node;
      dataListReceita.push({ key, title: key });
      if (node.children) {
        generateListReceita(node.children);
      }
    }
  };

  const generateListDespesa = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key, title } = node;
      dataListDespesa.push({ key: `${key}`, title });
      if (node.children) {
        generateListDespesa(node.children);
      }
    }
  };

  const onChangeSearchReceita = (e) => {
    const { value } = e.target;
    let expandedKeys = [];
    if (value.length > 2) {
      expandedKeys = dataListReceita
        .map((item) => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, categoriaTree.receitas);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
    }
    setState({
      ...state,
      receita: {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      },
    });
  };

  const onChangeSearchDespesa = (e) => {
    const { value } = e.target;
    let expandedKeys = [];
    if (value.length > 2) {
      expandedKeys = dataListDespesa
        .map((item) => {
          if (item.title.toLowerCase().indexOf(value.toLowerCase()) > -1) {
            return getParentKey(item.key, categoriaTree.despesas);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
    }

    setState({
      ...state,
      despesa: {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      },
    });
  };

  generateLists();

  const TreeCategoriaReceita = ({ treeData, tipo }) => {
    if (treeData.length === 0) {
      return (
        <Empty description={`Nenhuma categoria de receita encontrada!`}>
          <Button type="primary" onClick={() => novaCategoria(tipo)}>
            Criar agora
          </Button>
        </Empty>
      );
    } else {
      return (
        <>
          <Search
            value={state.receita.searchValue}
            style={{ marginBottom: 8 }}
            placeholder="Pesquisar"
            onChange={(event) => onChangeSearchReceita(event)}
          />
          <Tree
            showLine
            switcherIcon={<DownOutlined />}
            treeData={treeData}
            expandedKeys={state.receita.expandedKeys}
            autoExpandParent={state.receita.autoExpandParent}
          />
        </>
      );
    }
  };

  const TreeCategoriaDespesa = ({ treeData, tipo }) => {
    if (treeData.length === 0) {
      return (
        <Empty description={`Nenhuma categoria de despesa encontrada!`}>
          <Button type="primary" onClick={() => novaCategoria(tipo)}>
            Criar agora
          </Button>
        </Empty>
      );
    } else {
      return (
        <>
          <Search
            autoFocus
            value={state.despesa.searchValue}
            style={{ marginBottom: 8 }}
            placeholder="Pesquisar"
            onChange={onChangeSearchDespesa}
          />
          <Tree
            showLine
            switcherIcon={<DownOutlined />}
            treeData={treeData}
            defaultExpandedKeys={state.despesa.expandedKeys}
            autoExpandParent
          />
        </>
      );
    }
  };

  return (
    <div>
      <div>Categorias</div>
      <Collapse accordion>
        <Panel header="Receitas" key="1">
          <TreeCategoriaReceita
            treeData={categoriaTree.receitas}
            tipo="receita"
          />
        </Panel>
        <Panel header="Despesas" key="2">
          <TreeCategoriaDespesa
            treeData={categoriaTree.despesas}
            tipo="despesa"
          />
        </Panel>
      </Collapse>
      <CategoriaCadastroModal
        onFinish={onFinish}
        open={isModalOpen}
        form={form}
        handleCancel={handleCancel}
        tipo={tipo}
        categoriaPai={{}}
      />
    </div>
  );
};

const mapStateToProps = ({ categoriaReducer }) => {
  const {
    loading,
    message,
    showMessage,
    categorias,
    categoria,
    categoriaTree,
  } = categoriaReducer;

  return {
    loading,
    message,
    showMessage,
    categorias,
    categoria,
    categoriaTree,
  };
};

const mapDispatchToProps = {
  buscarTree,
};

export default connect(mapStateToProps, mapDispatchToProps)(Categoria);
