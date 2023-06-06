import { Button, Empty, Input, Tree } from "antd";
import { DownOutlined } from "@ant-design/icons";
import React from "react";
import { useState } from "react";

const { Search } = Input;
const { DirectoryTree } = Tree;

let dataList = [];

export const TreeCategoria = ({
  treeData,
  tipo,
  abrirModalCadastro,
  autoFocus,
  onSelectUp,
}) => {
  const [state, setState] = useState({
    searchValue: "",
    expandedKeys: [],
    selectedKeys: [],
    autoExpandParent: true,
  });

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

  const generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key, title } = node;
      if (dataList.filter((item) => item.key === key).length === 0) {
        dataList.push({ key: `${key}`, title, tipo });
      }
      if (node.children) {
        generateList(node.children);
      }
    }
  };

  const onChangeSearch = (e) => {
    const { value } = e.target;
    let expandedKeys = [];
    if (value.length > 2) {
      expandedKeys = dataList
        .map((item) => {
          if (item.title.toLowerCase().indexOf(value.toLowerCase()) > -1) {
            return getParentKey(item.key, treeData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
    }

    setState({
      ...state,
      expandedKeys,
      autoExpandParent: true,
      searchValue: value,
    });
  };

  const onSelect = (categoriaSelecionada) => {
    let selectedeKeyAux = categoriaSelecionada;
    if (
      Array.prototype.filter.call(state.selectedKeys, function (item) {
        return item === categoriaSelecionada[0];
      }).length >= 1
    ) {
      selectedeKeyAux = [];
    }

    setState({
      ...state,
      selectedKeys: selectedeKeyAux,
    });

    onSelectUp(tipo, selectedeKeyAux);
  };

  const onExpand = (expandKey) => {
    setState({ ...state, expandedKeys: expandKey, autoExpandParent: false });
  };

  generateList(treeData);

  if (treeData.length === 0) {
    return (
      <Empty description={`Nenhuma categoria de ${tipo} encontrada!`}>
        <Button type="primary" onClick={() => abrirModalCadastro(tipo)}>
          Criar agora
        </Button>
      </Empty>
    );
  } else {
    return (
      <>
        <Search
          autoFocus={autoFocus}
          value={state.searchValue}
          style={{ marginBottom: 8 }}
          placeholder="Pesquisar"
          onChange={onChangeSearch}
        />
        <DirectoryTree
          showLine
          showIcon={false}
          switcherIcon={<DownOutlined />}
          treeData={treeData}
          expandedKeys={state.expandedKeys}
          selectedKeys={state.selectedKeys}
          onSelect={onSelect}
          autoExpandParent={state.autoExpandParent}
          height={400}
          onExpand={onExpand}
        />
      </>
    );
  }
};
