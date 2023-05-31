import { Avatar, Button, List, Spin, Table, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { cadastrar, listar, excluir } from 'store/slices/metodoPagamentoSlice';
import InfiniteScroll from 'react-infinite-scroller';
import { notification } from 'antd';
import { Form } from 'antd';
import { Input } from 'antd';

const infiniteScroll = {
    border: '1px solid #e8e8e8',
    borderRadius: '4px',
    overflow: 'auto',
    padding: '8px 24px',
    height: '300px'
}

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};


export const MetodosPagamento = props => {

  const { 
    cadastrar,
    listar,
    excluir,
		loading,
		showMessage,
		message,
    metodosPagamentos,
    hasMore,
    registro
	} = props

  const [form] = Form.useForm();
  const [paginacao, setPaginacao] = useState({pageSize: 5,current: 0})

  const inclemento = 5

  const fetchMetodosPagamentos = () => {
    listar({size: paginacao.pageSize, page: paginacao.current});
  }

  const excluirMetodoPagamento = (metodoPagamento) => {
    excluir({id: metodoPagamento.id})
    .then((originalPromiseResult) => {
      notification.success({message: 'Método de pagamento excluído com sucesso!'})
      fetchMetodosPagamentos()
    })
    .catch((rejectedValueOrSerializedError) => notification.error({message: 'Ocorreu um erro ao tentar excluir!'}));
  }

  useEffect(() => {
      fetchMetodosPagamentos()
  }, []);

  const handleInfiniteOnLoad = () => {
    setPaginacao({...paginacao, pageSize: paginacao.pageSize + inclemento})
    fetchMetodosPagamentos();
  };

  const onFinish = values => {
    cadastrar(values)
    .then((originalPromiseResult) => {
      form.resetFields();
      notification.success({message: 'Método de pagamento cadastrado com sucesso!'})
      fetchMetodosPagamentos()
    })
    .catch((rejectedValueOrSerializedError) => notification.error({message: 'Ocorreu um erro ao tentar cadastrar!'}));
  };

  const actions = (metodoPagamento) => {
    return [
      <Button type="primary" danger size="small" onClick={() => excluirMetodoPagamento(metodoPagamento)}>Excluir</Button>
    ]
  }

  return (
    <div>
      <div>
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
      <Form.Item name="nome" label="Nome" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="descricao" label="Descrição" rules={[{ required: false }]}>
        <Input />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button className="mr-2" type="primary" htmlType="submit">
          Cadastrar
        </Button>
      </Form.Item>
      </Form>
      </div>
    <div style={infiniteScroll}>
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={() => handleInfiniteOnLoad()}
        hasMore={!loading && hasMore}
        useWindow={false}
      >

        <List
            dataSource={metodosPagamentos}
            renderItem={metodoPagamento => (
              <List.Item key={metodoPagamento.id} actions={actions(metodoPagamento)}>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://as2.ftcdn.net/v2/jpg/00/72/77/79/1000_F_72777900_PuZflEq56bzqNr7SqGq2X59MsfC9aDPp.jpg" />
                  }
                  title={metodoPagamento.nome}
                  description={metodoPagamento.descricao || ''}
                />
              </List.Item>
              )}
          >
            {loading && hasMore && (
              <div className="demo-loading-container" style={{textAlign: 'center'}}>
                <Spin />
              </div>
            )}
          </List>

      </InfiniteScroll>
    </div>
    </div>
  )
}

const mapStateToProps = ({metodosPagamentoReducer}) => {
	const {loading, hasMore, message, showMessage, metodosPagamentos, registro} = metodosPagamentoReducer;
  return {loading, hasMore, message, showMessage, metodosPagamentos, registro}
}

const mapDispatchToProps = {
  cadastrar,
	listar,
  excluir
}

export default connect(mapStateToProps, mapDispatchToProps)(MetodosPagamento)
