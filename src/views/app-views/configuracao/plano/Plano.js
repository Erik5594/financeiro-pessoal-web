import React, { Fragment } from "react";
import { buscar, atualizar } from "store/slices/planoSlice";
import { connect } from "react-redux";
import { Badge, Button, Card, Col, Grid, Row, Tag } from "antd";
import Utils from "utils";
import IntlMessage from "components/util-components/IntlMessage";

const { useBreakpoint } = Grid;

const pricingData = [
  {
    atual: true,
    image: "/img/others/img-1.png",
    price: "118,80",
    duration: "/ por ano",
    plan: "Startup",
    free: "33% off",
    features: [
      "Dashboards intuitivos",
      "Cadastro de despesa ilimitado",
      "Cadastro de categorias ilimitada",
      "Cadastro de despesa simples",
      "Cadastro de despesa parcelada",
      "Cadastro de despesa recorrente",
      "Cadastro de despesa por código de barras",
    ],
    proxVencimento: "20/05/2025",
  },
  {
    atual: false,
    image: "/img/others/img-2.png",
    price: "38,70",
    duration: "/ trimestral",
    plan: "Standard",
    free: "13% off",
    features: [
      "Dashboards intuitivos",
      "Cadastro de despesa ilimitado",
      "Cadastro de categorias ilimitada",
      "Cadastro de despesa simples",
      "Cadastro de despesa parcelada",
      "Cadastro de despesa recorrente",
      "Cadastro de despesa por código de barras",
    ],
    proxVencimento: "20/08/2024",
  },
  {
    atual: false,
    image: "/img/others/img-3.png",
    price: "14,90",
    duration: "/ por mês",
    plan: "Premium",
    free: "0% off",
    features: [
      "Dashboards intuitivos",
      "Cadastro de despesa ilimitado",
      "Cadastro de categorias ilimitada",
      "Cadastro de despesa simples",
      "Cadastro de despesa parcelada",
      "Cadastro de despesa recorrente",
      "Cadastro de despesa por código de barras",
    ],
    proxVencimento: "20/06/2024",
  },
];

export const Plano = (props) => {
  const isMobile = !Utils.getBreakPoint(useBreakpoint()).includes("lg");
  const colCount = pricingData.length;

  return (
    <Fragment>
      <strong>FUNCIONALIDADES</strong>
      <ul>
        <li>
          1.4.3 - [FUNCIONALIDADE] - Selecionar plano. [IMPLEMENTAR - Erik]
        </li>
        <li>
          1.4.6 - [FUNCIONALIDADE] - Cancelar assinatura. [IMPLEMENTAR - Erik]
        </li>
      </ul>
      <Card>
        <div className="container">
          <div className="pt-lg-4">
            <h1 className="text-center font-weight-semibold">
              <IntlMessage id="caracteristicas" />
            </h1>
          </div>
          <Row sm={24} md={24} lg={24} className="mb-3">
            <Col sm={24} md={12} lg={8} style={{ display: "block" }}>
              <div className="d-flex">
                <div>
                  <p>
                    <Badge color={"blue"} />
                    <span style={{ marginLeft: "5px" }}>
                      Dashboards intuitivos
                    </span>
                  </p>
                </div>
              </div>
              <div className="d-flex">
                <div>
                  <p>
                    <Badge color={"blue"} />
                    <span style={{ marginLeft: "5px" }}>
                      Cadastro de despesa ilimitado
                    </span>
                  </p>
                </div>
              </div>
              <div className="d-flex">
                <div>
                  <p>
                    <Badge color={"blue"} />
                    <span style={{ marginLeft: "5px" }}>
                      Cadastro de categorias ilimitada
                    </span>
                  </p>
                </div>
              </div>
            </Col>
            <Col sm={24} md={12} lg={8}>
              <div className="d-flex">
                <div>
                  <p>
                    <Badge color={"blue"} />
                    <span style={{ marginLeft: "5px" }}>
                      Cadastro de formas de pagamento ilimitada
                    </span>
                  </p>
                </div>
              </div>
              <div className="d-flex">
                <div>
                  <p>
                    <Badge color={"blue"} />
                    <span style={{ marginLeft: "5px" }}>
                      Cadastro de despesa simples
                    </span>
                  </p>
                </div>
              </div>
              <div className="d-flex">
                <div>
                  <p>
                    <Badge color={"blue"} />
                    <span style={{ marginLeft: "5px" }}>
                      Cadastro de despesa parcelada
                    </span>
                  </p>
                </div>
              </div>
            </Col>
            <Col sm={24} md={12} lg={8}>
              <div className="d-flex">
                <div>
                  <p>
                    <Badge color={"blue"} />
                    <span style={{ marginLeft: "5px" }}>
                      Cadastro de despesa recorrente
                    </span>
                  </p>
                </div>
              </div>
              <div className="d-flex">
                <div>
                  <p>
                    <Badge color={"blue"} />
                    <span style={{ marginLeft: "5px" }}>
                      Cadastro de despesa por código de barras
                    </span>
                  </p>
                </div>
              </div>
            </Col>
          </Row>
          <div className="text-center mb-4">
            <h2 className="font-weight-semibold">
              <IntlMessage id="plan.select.please" />
            </h2>
            <Row type="flex" justify="center">
              <Col sm={24} md={12} lg={8}>
                <p>
                  <IntlMessage id="plan.select.obs" />
                </p>
              </Col>
            </Row>
          </div>
          <Row>
            {pricingData.map((elm, i) => {
              return (
                <Col
                  key={`price-column-${i}`}
                  xs={24}
                  sm={24}
                  md={24 / colCount}
                  lg={24 / colCount}
                  className={
                    colCount === i + 1 || isMobile ? "" : "border-right"
                  }
                >
                  <div className="p-3">
                    <div className="text-center">
                      <img className="img-fluid" src={elm.image} alt="" />
                      <h1 className="display-4 mt-4">
                        <span
                          className="font-size-md d-inline-block mr-1"
                          style={{ transform: "translate(0px, -17px)" }}
                        >
                          <IntlMessage id="simbolo.moeda" />
                        </span>
                        <span>{elm.price}</span>
                      </h1>
                      <p className="mb-0">{elm.duration}</p>
                      <Tag color="green">{elm.free}</Tag>
                    </div>
                    <div className="mt-4">
                      <h2 className="text-center font-weight-semibold">
                        {elm.plan}
                      </h2>
                    </div>
                    <div className="mt-3 text-center">
                      <Button type="primary" disabled={elm.atual}>
                        {elm.atual ? (
                          <IntlMessage id="plano.atual" />
                        ) : (
                          <IntlMessage id="escolher" />
                        )}
                      </Button>
                      {elm.atual ? (
                        <div>
                          <span className="font-size-sm">
                            *Proximo vencimento: {elm.proxVencimento}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
          <div className="mt-5 pt-lg-4">
            <h1 className="text-center font-weight-light">
              <IntlMessage id="perguntas.frequentes" />
            </h1>
          </div>
          <Row gutter={60} className="mt-5">
            <Col sm={24} md={12} lg={12}>
              <div className="mb-5">
                <h3 className="font-weight-semibold">Is it expensive?</h3>
                <p>
                  Twitch tail in permanent irritation poop on grasses, drink
                  water out of the faucet, plays league of legends have my
                  breakfast spaghetti yarn. Taco cat backwards spells taco cat
                  stick butt in face.
                </p>
              </div>
              <div className="mb-5">
                <h3 className="font-weight-semibold">Is it secure?</h3>
                <p>
                  Splice the main brace Jolly Roger me hogshead prow red ensign
                  ye swing the lead log ho. Handsomely spanker dance the hempen
                  jig pinnace overhaul crimp tack booty rigging lateen sail. Sea
                  Legs boatswain hempen halter provost bilge rat ballast maroon
                  man-of-war bowsprit Chain Shot.
                </p>
              </div>
            </Col>
            <Col sm={24} md={12} lg={12}>
              <div className="mb-5">
                <h3 className="font-weight-semibold">How to start?</h3>
                <p>
                  Purr like an angel nap all day, for poop on grasses for chase
                  after silly colored fish toys around the house stares at human
                  while pushing stuff off a table or i heard this rumor where
                  the humans are our owners.
                </p>
              </div>
              <div className="mb-5">
                <h3 className="font-weight-semibold">Is there any discount?</h3>
                <p>
                  Cry louder at reflection. More napping, more napping all the
                  napping is exhausting toilet paper attack claws fluff
                  everywhere meow miao french ciao litterbox.
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    </Fragment>
  );
};

const mapStateToProps = ({ planoReducer }) => {
  const { loading, message, showMessage, plano } = planoReducer;
  return {
    loading,
    message,
    showMessage,
    plano,
  };
};

const mapDispatchToProps = {
  buscar,
};

export default connect(mapStateToProps, mapDispatchToProps)(Plano);
