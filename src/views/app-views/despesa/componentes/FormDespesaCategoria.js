import React, { Fragment } from "react";
import FormCategoriaList from "views/app-views/categoria/componentes/FormCategoriaList";
import TableCategoriaDespesa from "./TableCategoriaDespesa";

export const FormDespesaCategoria = ({
  isEdicao,
  isParcelado,
  categorias,
  onAddCategoria,
  form,
  tableCategoriaDespesa,
  onRemoverDespesaCategoria,
  onEditarDespesaCategoria,
}) => {
  return (
    <Fragment>
      <div style={{ display: isEdicao && isParcelado ? "none" : "flex" }}>
        <FormCategoriaList
          categorias={categorias}
          onAddCategoria={onAddCategoria}
          form={form}
        />
      </div>
      <TableCategoriaDespesa
        categoriasDespesas={tableCategoriaDespesa}
        disabledOptionRemove={isEdicao && isParcelado}
        onRemoverDespesaCategoria={onRemoverDespesaCategoria}
        onEditarDespesaCategoria={onEditarDespesaCategoria}
      />
    </Fragment>
  );
};

export default FormDespesaCategoria;
