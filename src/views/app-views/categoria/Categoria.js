import { Button, Collapse, Form, Popconfirm, notification } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  buscarById,
  buscarTree,
  cadastrar,
  editar,
  excluir,
} from "store/slices/categoriaSlice";
import CategoriaCadastroModal from "./CategoriaCadastroModal";
import { TreeCategoria } from "./componentes/TreeCategoria";

const { Panel } = Collapse;

const titulo = {
  marginBottom: "20px",
  fontSize: "x-large",
};

export const Categoria = (props) => {
  const { buscarTree, buscarById, cadastrar, editar, excluir, categoriaTree } =
    props;
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdicao, setIsEdicao] = useState(false);
  const [tipo, setTipo] = useState("receita");

  const initialValue = {
    expandedKeys: [],
    selectedKeys: [],
    categoria: {},
    idCategoriaParent: "",
    idCategoriaPai: "",
    caminho: "",
    caminhoParent: "",
    searchValue: "",
    autoExpandParent: true,
  };

  const [state, setState] = useState({
    despesa: initialValue,
    receita: initialValue,
  });
  const [fields, setFields] = useState([]);

  const fetchCategoria = () => {
    buscarTree();
  };

  useEffect(() => {
    fetchCategoria();
  }, []);

  const abrirModalCadastro = (tipo) => {
    setTipo(tipo);
    setIsEdicao(false);
    const values = tipo === "receita" ? state.receita : state.despesa;
    setFields([
      { name: ["nome"], value: "" },
      { name: ["descricao"], value: "" },
      { name: ["categoriaPai"], value: values.caminho },
    ]);
    setIsModalOpen(true);
  };

  const abrirModalEditar = (tipo) => {
    setTipo(tipo);
    setIsEdicao(true);
    const values = tipo === "receita" ? state.receita : state.despesa;
    buscarById({ id: values.idCategoriaPai })
      .then((originalPromiseResult) => {
        if (originalPromiseResult.payload !== "Error") {
          const retorno = originalPromiseResult.payload;
          setFields([
            { name: ["nome"], value: retorno.nome },
            { name: ["descricao"], value: retorno.descricao },
            { name: ["categoriaPai"], value: values.caminhoParent },
          ]);
          setIsModalOpen(true);
        }
      })
      .catch((rejectedValueOrSerializedError) =>
        notification.error({ message: "Ocorreu um erro ao tentar cadastrar!" })
      );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const cadastrarAction = async (values) => {
    await cadastrar({
      nome: values.nome,
      descricao: values.descricao,
      idCategoriaPai: values.idCategoriaPai,
      natureza: values.natureza,
    })
      .then((originalPromiseResult) => {
        notification.success({
          message: "Cadastro realizado com sucesso!",
        });
        form.resetFields();
        fetchCategoria();
        setIsModalOpen(false);
      })
      .catch((rejectedValueOrSerializedError) =>
        notification.error({ message: "Ocorreu um erro ao tentar cadastrar!" })
      );
  };

  const editarAction = async (values) => {
    const idCategoriaPai = getParentKey(
      values.idCategoriaPai,
      tipo === "receita" ? categoriaTree.receitas : categoriaTree.despesas
    );

    await editar({
      id: values.idCategoriaPai,
      nome: values.nome,
      descricao: values.descricao,
      idCategoriaPai: idCategoriaPai,
      natureza: values.natureza,
    })
      .then((originalPromiseResult) => {
        notification.success({
          message: "Cadastro editado com sucesso!",
        });
        form.resetFields();
        fetchCategoria();
        setIsModalOpen(false);
      })
      .catch((rejectedValueOrSerializedError) =>
        notification.error({ message: "Ocorreu um erro ao tentar editar!" })
      );
  };

  const onFinish = async (values) => {
    if (isEdicao) {
      editarAction(values);
    } else {
      cadastrarAction(values);
    }
  };

  const onExcluir = async (tipo) => {
    await excluir({
      id:
        tipo === "receita"
          ? state.receita.idCategoriaPai
          : state.despesa.idCategoriaPai,
    })
      .then((originalPromiseResult) => {
        if (originalPromiseResult.payload !== "Error") {
          notification.success({
            message: "Categoria excluida com sucesso!",
          });
          form.resetFields();
          fetchCategoria();
          setIsModalOpen(false);
          if (tipo === "receita") {
            setState({ ...state, receita: initialValue });
          } else {
            setState({ ...state, despesa: initialValue });
          }
        }
      })
      .catch((rejectedValueOrSerializedError) =>
        notification.error({
          message: "Ocorreu um erro ao tentar excluir categoria!",
        })
      );
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

  const onSelect = (tipo, categoriaSelecionada) => {
    let nomeCaminho = "";
    let nomeCaminhoParent = "";
    let idCategoriaSelecionada = "";
    let idCategoriaSelecionadaParent = "";
    if (categoriaSelecionada && categoriaSelecionada.length !== 0) {
      idCategoriaSelecionada = categoriaSelecionada[0];
      nomeCaminho = getNomeCaminhoCategoria(categoriaSelecionada[0], tipo);
      nomeCaminhoParent = getNomeCaminhoCategoriaParent(
        categoriaSelecionada[0],
        tipo
      );
    }
    if (tipo === "receita") {
      setState({
        ...state,
        receita: {
          ...state.receita,
          idCategoriaPai: idCategoriaSelecionada,
          caminho: nomeCaminho,
          idCategoriaParent: idCategoriaSelecionadaParent,
          caminhoParent: nomeCaminhoParent,
        },
      });
    } else {
      setState({
        ...state,
        despesa: {
          ...state.despesa,
          idCategoriaPai: idCategoriaSelecionada,
          caminho: nomeCaminho,
          idCategoriaParent: idCategoriaSelecionadaParent,
          caminhoParent: nomeCaminhoParent,
        },
      });
    }
  };

  const getNomeCaminhoCategoria = (idCategoriaSelecionada, tipo) => {
    const nomeCategorias = getNomesCategorias(idCategoriaSelecionada, tipo);

    let nomeCompleto = "";
    for (let i = nomeCategorias.length - 1; i >= 0; i--) {
      nomeCompleto = nomeCompleto + nomeCategorias[i];
      if (i !== 0) {
        nomeCompleto = nomeCompleto + " >> ";
      }
    }
    return nomeCompleto;
  };

  const getNomeCaminhoCategoriaParent = (idCategoriaSelecionada, tipo) => {
    const nomeCategorias = getNomesCategorias(idCategoriaSelecionada, tipo);

    let nomeCompleto = "";
    for (let i = nomeCategorias.length - 1; i >= 1; i--) {
      nomeCompleto = nomeCompleto + nomeCategorias[i];
      if (i !== 1) {
        nomeCompleto = nomeCompleto + " >> ";
      }
    }
    return nomeCompleto;
  };

  const getNomesCategorias = (idCategoriaSelecionada, tipo) => {
    const nomeCategorias = [];
    let idCategoria = idCategoriaSelecionada;

    nomeCategorias.push(
      getNomeCategoria(
        idCategoria,
        tipo === "receita" ? categoriaTree.receitas : categoriaTree.despesas
      )
    );

    while (
      getParentKey(
        idCategoria,
        tipo === "receita" ? categoriaTree.receitas : categoriaTree.despesas
      )
    ) {
      idCategoria = getParentKey(
        idCategoria,
        tipo === "receita" ? categoriaTree.receitas : categoriaTree.despesas
      );
      nomeCategorias.push(
        getNomeCategoria(
          idCategoria,
          tipo === "receita" ? categoriaTree.receitas : categoriaTree.despesas
        )
      );
    }
    return nomeCategorias;
  };

  const getNomeCategoria = (key, tree) => {
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.key === key) {
        return node.title;
      }
      if (node.children) {
        if (getNomeCategoria(key, node.children)) {
          return getNomeCategoria(key, node.children);
        }
      }
    }
  };

  const acoesPanel = (tipo) => {
    return (
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "5px" }}>
          <Button
            type="primary"
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              abrirModalCadastro(tipo);
            }}
          >
            Nova
          </Button>
        </div>
        <div style={{ marginRight: "5px" }}>
          <Button
            onClick={(event) => {
              event.stopPropagation();
              abrirModalEditar(tipo);
            }}
            size="small"
            disabled={
              tipo === "receita"
                ? !state.receita.idCategoriaPai
                : !state.despesa.idCategoriaPai
            }
          >
            Editar
          </Button>
        </div>
        <div style={{ marginRight: "5px" }}>
          <Popconfirm
            placement="bottom"
            title="Tem certeza que deseja excluir essa categoria?"
            okText="Sim"
            cancelText="Não"
            onConfirm={(event) => {
              event.stopPropagation();
              onExcluir(tipo);
            }}
            onCancel={(event) => {
              event.stopPropagation();
            }}
          >
            <Button
              onClick={(event) => {
                event.stopPropagation();
              }}
              size="small"
              disabled={
                tipo === "receita"
                  ? !state.receita.idCategoriaPai
                  : !state.despesa.idCategoriaPai
              }
              type="primary"
              danger
            >
              Excluir
            </Button>
          </Popconfirm>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={titulo}>Categorias</div>
      <Collapse accordion defaultActiveKey={["2"]}>
        {/**<Panel header="Receitas" key="1" extra={acoesPanel("receita")}>
          <TreeCategoria
            autoFocus={!isModalOpen}
            treeData={categoriaTree.receitas}
            tipo="receita"
            abrirModalCadastro={abrirModalCadastro}
            onSelectUp={onSelect}
          />
  </Panel>**/}
        <Panel header="Despesas" key="2" extra={acoesPanel("despesa")}>
          <TreeCategoria
            autoFocus={!isModalOpen}
            treeData={categoriaTree.despesas}
            tipo="despesa"
            abrirModalCadastro={abrirModalCadastro}
            onSelectUp={onSelect}
          />
        </Panel>
      </Collapse>
      <CategoriaCadastroModal
        form={form}
        onFinish={onFinish}
        open={isModalOpen}
        fields={fields}
        onChange={(newFields) => {
          setFields(newFields);
        }}
        handleCancel={handleCancel}
        tipo={tipo}
        idCategoriaPai={
          tipo === "receita"
            ? state.receita.idCategoriaPai
            : state.despesa.idCategoriaPai
        }
        isEdicao={isEdicao}
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
  buscarById,
  cadastrar,
  editar,
  excluir,
};

export default connect(mapStateToProps, mapDispatchToProps)(Categoria);
