import { Avatar, Button, List, Spin, Table, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { listar } from 'store/slices/metodoPagamentoSlice';
import InfiniteScroll from 'react-infinite-scroller';

const infiniteScroll = {
    border: '1px solid #e8e8e8',
    borderRadius: '4px',
    overflow: 'auto',
    padding: '8px 24px',
    height: '300px'
}


export const MetodosPagamento = props => {

  const { 
    listar,
		loading,
		showMessage,
		message,
    metodosPagamentos,
    hasMore,
    registro
	} = props

  const [paginacao, setPaginacao] = useState({pageSize: 5,current: 0})

  const inclemento = 5

  const fetchMetodosPagamentos = () => {
    listar({size: paginacao.pageSize, page: paginacao.current});
  }

  useEffect(() => {
      fetchMetodosPagamentos()
  }, []);

  const handleInfiniteOnLoad = () => {
    setPaginacao({...paginacao, pageSize: paginacao.pageSize + inclemento})
    fetchMetodosPagamentos();
  };
  
  return (
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
              <List.Item key={metodoPagamento.id}>
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
  )
}

const mapStateToProps = ({metodosPagamentoReducer}) => {
	const {loading, hasMore, message, showMessage, metodosPagamentos, registro} = metodosPagamentoReducer;
  return {loading, hasMore, message, showMessage, metodosPagamentos, registro}
}

const mapDispatchToProps = {
	listar
}

export default connect(mapStateToProps, mapDispatchToProps)(MetodosPagamento)
