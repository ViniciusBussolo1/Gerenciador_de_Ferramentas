import { FormEvent, useEffect, useState } from "react";
import { GoX } from "react-icons/go";
import Modal from "react-modal";

import { Card } from "./components/Card/card";

import Axios from "axios";

import "./index.scss";

interface tools {
  id: string;
  title: string;
  description: string;
  link: string;
  tags: Array<string>;
}

Modal.setAppElement("#root");

export function App() {
  const Api = "http://localhost:3000/tools";

  const [busca, setBusca] = useState("");

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tag, setTag] = useState("");

  const [arrayTags, setArrayTags] = useState<Array<string>>([]);
  const [arrayTools, setArrayTools] = useState<tools[]>([]);

  const [modalIsOpen, setIsOpen] = useState(false);

  const customStyles = {
    overlay: {
      backgroundColor: "#131313cc",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "black",
    },
  };

  const lowerCase = busca.toLowerCase();

  const filteredTools =
    busca.length > 0
      ? arrayTools.filter((repo) =>
          repo.title.toLowerCase().includes(lowerCase)
        )
      : [];

  useEffect(() => {
    Axios.get(Api).then((resp) => {
      const data = resp.data;

      setArrayTools(data);
    });
  }, [arrayTools]);

  function handleAddTool(event: FormEvent) {
    event.preventDefault();

    const tagsProps = {
      title: title,
      description: descricao,
      link: link,
      tags: arrayTags,
    };

    Axios.post(Api, tagsProps).then((resp) => {
      if (resp) {
        window.alert("Ferramenta inserida com sucesso!");
      }
    });

    setTitle("");
    setLink("");
    setDescricao("");
    setTag("");
  }

  function handleModal() {
    setIsOpen(!modalIsOpen);
  }

  function handleAddTags() {
    setArrayTags((arrayTags) => [...arrayTags, tag]);
    setTag("");
  }

  function handleRemoveTool(id: Number) {
    let resultado = confirm("Deseja excluir este item!");
    if (resultado == true) {
      Axios.delete(`${Api}/${id}`);
      alert("O item foi escluido com sucesso!");
    }
  }

  return (
    <>
      <div className="div-main">
        <header>
          <h1>VUTTR</h1>
          <p>Very Useful Tools to Remember</p>
        </header>
        <div className="div-actions">
          <input
            type="text"
            placeholder="search"
            onChange={(e) => setBusca(e.target.value)}
            value={busca}
          />
          <button className="button-add" onClick={handleModal}>
            ADD
          </button>
        </div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={handleModal}
          style={customStyles}
        >
          <h1>Adicionar Ferramenta</h1>

          <form className="modal-form" onSubmit={handleAddTool}>
            <div>
              <label htmlFor="nome">Nome da Ferramenta</label>
              <input
                type="text"
                id="nome"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </div>
            <div>
              <label htmlFor="link">Link da Ferramenta</label>
              <input
                type="text"
                id="link"
                onChange={(e) => setLink(e.target.value)}
                value={link}
              />
            </div>
            <div>
              <label htmlFor="descricao">Descrição da Ferramenta</label>
              <textarea
                id="descricao"
                onChange={(e) => setDescricao(e.target.value)}
                value={descricao}
              />
            </div>
            <div>
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                onChange={(e) => setTag(e.target.value)}
                value={tag}
              />
            </div>
            <div className="modal-div-buttons">
              <div>
                <button
                  type="button"
                  className="button-add-tag"
                  onClick={handleAddTags}
                >
                  Adicionar tag
                </button>
              </div>
              <div className="div-buttons">
                <button type="submit" className="button-enviar">
                  Enviar
                </button>
                <button onClick={handleModal}>Cancelar</button>
              </div>
            </div>
          </form>
        </Modal>

        {busca.length > 0
          ? filteredTools.map((data) => (
              <Card key={data.id}>
                <div className="div-card-actions">
                  <h2>
                    <a href={data.link}>{data.title}</a>
                  </h2>
                  <button
                    className="button-remove"
                    onClick={() => handleRemoveTool(Number(data.id))}
                  >
                    <GoX className="icon-remove" />
                    Remove
                  </button>
                </div>
                <p>{data.description}</p>
                <div className="div-tags">
                  {data.tags.map((resp) => (
                    <span className="tags" key={resp}>
                      #{resp}
                    </span>
                  ))}
                </div>
              </Card>
            ))
          : arrayTools.map((data) => (
              <Card key={data.id}>
                <div className="div-card-actions">
                  <h2>
                    <a href={data.link}>{data.title}</a>
                  </h2>
                  <button
                    className="button-remove"
                    onClick={() => handleRemoveTool(Number(data.id))}
                  >
                    <GoX className="icon-remove" />
                    Remove
                  </button>
                </div>
                <p>{data.description}</p>
                <div className="div-tags">
                  {data.tags.map((resp) => (
                    <span className="tags" key={resp}>
                      #{resp}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
      </div>
    </>
  );
}
