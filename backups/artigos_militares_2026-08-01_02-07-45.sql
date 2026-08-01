--
-- PostgreSQL database dump
--

\restrict wzJDiu7wc9A6DURXXN5z6RFyEu3fuE2enbzZJTSjhsbW2B3wcW50yQYaPkyLW0x

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.pedidos DROP CONSTRAINT IF EXISTS fk_pedidos_usuario;
ALTER TABLE IF EXISTS ONLY public.pedido_itens DROP CONSTRAINT IF EXISTS fk_itens_produto;
ALTER TABLE IF EXISTS ONLY public.pedido_itens DROP CONSTRAINT IF EXISTS fk_itens_pedido;
DROP INDEX IF EXISTS public.idx_produtos_patente;
DROP INDEX IF EXISTS public.idx_produtos_categoria;
DROP INDEX IF EXISTS public.idx_produtos_ativo;
DROP INDEX IF EXISTS public.idx_pedidos_usuario;
DROP INDEX IF EXISTS public.idx_pedido_itens_pedido;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_pkey;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_email_key;
ALTER TABLE IF EXISTS ONLY public.produtos DROP CONSTRAINT IF EXISTS produtos_pkey;
ALTER TABLE IF EXISTS ONLY public.pedidos DROP CONSTRAINT IF EXISTS pedidos_pkey;
ALTER TABLE IF EXISTS ONLY public.pedido_itens DROP CONSTRAINT IF EXISTS pedido_itens_pkey;
ALTER TABLE IF EXISTS public.usuarios ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.produtos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.pedidos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.pedido_itens ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.usuarios_id_seq;
DROP TABLE IF EXISTS public.usuarios;
DROP SEQUENCE IF EXISTS public.produtos_id_seq;
DROP TABLE IF EXISTS public.produtos;
DROP SEQUENCE IF EXISTS public.pedidos_id_seq;
DROP TABLE IF EXISTS public.pedidos;
DROP SEQUENCE IF EXISTS public.pedido_itens_id_seq;
DROP TABLE IF EXISTS public.pedido_itens;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: pedido_itens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pedido_itens (
    id bigint NOT NULL,
    pedido_id bigint NOT NULL,
    produto_id bigint,
    quantidade integer NOT NULL,
    tamanho text,
    personalizacao text,
    valor_unitario numeric(12,2) NOT NULL
);


--
-- Name: pedido_itens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pedido_itens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pedido_itens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pedido_itens_id_seq OWNED BY public.pedido_itens.id;


--
-- Name: pedidos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pedidos (
    id bigint NOT NULL,
    usuario_id bigint,
    status text DEFAULT 'pendente'::text,
    forma_pagamento text,
    total_pix numeric(12,2),
    total_cartao numeric(12,2),
    batalhao text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: pedidos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pedidos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pedidos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pedidos_id_seq OWNED BY public.pedidos.id;


--
-- Name: produtos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.produtos (
    id bigint NOT NULL,
    titulo text NOT NULL,
    descricao text,
    categoria text NOT NULL,
    patente text,
    preco numeric(12,2) DEFAULT 0 NOT NULL,
    preco_promocional numeric(12,2),
    quantidade_minima_promo integer DEFAULT 1,
    imagem text,
    estoque integer DEFAULT 0,
    personalizavel boolean DEFAULT false,
    tamanho boolean DEFAULT true,
    ativo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: produtos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.produtos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: produtos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.produtos_id_seq OWNED BY public.produtos.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuarios (
    id bigint NOT NULL,
    nome text NOT NULL,
    email text NOT NULL,
    senha_hash text NOT NULL,
    telefone text,
    patente text,
    administrador boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuarios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: pedido_itens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido_itens ALTER COLUMN id SET DEFAULT nextval('public.pedido_itens_id_seq'::regclass);


--
-- Name: pedidos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedidos ALTER COLUMN id SET DEFAULT nextval('public.pedidos_id_seq'::regclass);


--
-- Name: produtos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.produtos ALTER COLUMN id SET DEFAULT nextval('public.produtos_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: pedido_itens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pedido_itens (id, pedido_id, produto_id, quantidade, tamanho, personalizacao, valor_unitario) FROM stdin;
\.


--
-- Data for Name: pedidos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pedidos (id, usuario_id, status, forma_pagamento, total_pix, total_cartao, batalhao, created_at) FROM stdin;
\.


--
-- Data for Name: produtos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.produtos (id, titulo, descricao, categoria, patente, preco, preco_promocional, quantidade_minima_promo, imagem, estoque, personalizavel, tamanho, ativo, created_at) FROM stdin;
65	Abafador Auricular	\N	Acessórios	geral	40.00	30.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
61	Bandoleira — 1 Ponta	\N	Acessórios	geral	60.00	50.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
62	Bandoleira — 2 Pontas	\N	Acessórios	geral	60.00	50.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
63	Bandoleira — 3 Pontas	\N	Acessórios	geral	60.00	50.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
66	Adaptador de Perna para Coldre da PM	\N	Acessórios	geral	65.00	55.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
46	Alicate Multiuso	\N	Acessórios	geral	55.00	45.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
55	Cadeado com Chave	\N	Acessórios	geral	35.00	30.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
54	Cadeado com Segredo	\N	Acessórios	geral	35.00	30.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
64	Capa Modular	\N	Acessórios	geral	580.00	520.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
45	Carregador Bélica de Polímero	\N	Acessórios	geral	135.00	120.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
44	Coldre da DM	\N	Acessórios	geral	115.00	100.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
59	Elástico para Prancheta Personalizada	\N	Acessórios	geral	20.00	15.00	1	\N	0	t	f	t	2026-08-01 01:36:14.359706-03
48	Faca Padrão da Polícia — Modelo 1	\N	Acessórios	geral	60.00	50.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
49	Faca Padrão da Polícia — Modelo 2	\N	Acessórios	geral	70.00	60.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
43	Faixa Refletiva	\N	Acessórios	geral	35.00	25.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
53	Graxa	\N	Acessórios	geral	50.00	40.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
60	Kit Escova de Sapato	\N	Acessórios	geral	35.00	25.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
50	Lanterna USB	\N	Acessórios	geral	40.00	35.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
56	Organizador de Armário	\N	Acessórios	geral	60.00	50.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
47	Porta-Carregador de Fuzil	\N	Acessórios	geral	95.00	75.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
58	Prancheta Personalizada	\N	Acessórios	geral	70.00	60.00	1	\N	0	t	f	t	2026-08-01 01:36:14.359706-03
67	Priscila Emborrachada	\N	Acessórios	geral	25.00	20.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
68	Priscila de Pano	\N	Acessórios	geral	25.00	20.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
70	Protetor Lombar	\N	Acessórios	geral	130.00	120.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
69	Touca de Natação	\N	Acessórios	geral	30.00	20.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
57	Transportador de Farda	\N	Acessórios	geral	60.00	50.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
52	Verniz 100 ml	\N	Acessórios	geral	35.00	25.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
51	Verniz 250 ml	\N	Acessórios	geral	50.00	40.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
19	Bandeira Paulista Bordada	\N	Bordados	geral	20.00	10.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
18	Curso CAIS	\N	Bordados	geral	8.00	5.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
16	Curso de SD	\N	Bordados	sd	8.00	5.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
17	Curso de SGT	\N	Bordados	sgt	8.00	5.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
72	Targeta Ed.Física	\N	Bordados	geral	9.00	7.00	3	\N	0	t	f	t	2026-08-01 02:04:13.508421-03
71	Targeta operacional	\N	Bordados	geral	9.00	6.77	3	\N	0	t	f	t	2026-08-01 02:04:13.508421-03
28	Bandeira Paulista Emborrachada	\N	Emborrachados	geral	30.00	20.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
29	Brasões dos Batalhões Emborrachados	\N	Emborrachados	geral	40.00	30.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
24	Cursos Emborrachados	\N	Emborrachados	geral	30.00	20.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
26	Direção Defensiva	\N	Emborrachados	geral	30.00	20.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
34	Divisa Emborrachada para Colete Modular — 1º SGT	\N	Emborrachados	sgt	30.00	20.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
33	Divisa Emborrachada para Colete Modular — 2º SGT	\N	Emborrachados	sgt	30.00	20.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
32	Divisa Emborrachada para Colete Modular — 3º SGT	\N	Emborrachados	sgt	30.00	20.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
31	Divisa Emborrachada para Colete Modular — CB	\N	Emborrachados	cb	30.00	20.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
30	Divisa Emborrachada para Colete Modular — SD	\N	Emborrachados	sd	30.00	20.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
39	Divisa Emborrachada para Gandola — 1º SGT	\N	Emborrachados	sgt	8.00	5.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
38	Divisa Emborrachada para Gandola — 2º SGT	\N	Emborrachados	sgt	8.00	5.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
37	Divisa Emborrachada para Gandola — 3º SGT	\N	Emborrachados	sgt	8.00	5.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
42	Divisa Emborrachada para Gandola — Bomboneiro	\N	Emborrachados	geral	8.00	5.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
41	Divisa Emborrachada para Gandola — Bucaneiro	\N	Emborrachados	geral	8.00	5.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
36	Divisa Emborrachada para Gandola — CB	\N	Emborrachados	cb	8.00	5.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
35	Divisa Emborrachada para Gandola — SD	\N	Emborrachados	sd	8.00	5.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
40	Divisa Emborrachada para Gandola — Subtenente	\N	Emborrachados	geral	8.00	5.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
20	Listel	\N	Emborrachados	geral	30.00	20.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
21	Logo Colorido	\N	Emborrachados	geral	30.00	20.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
23	Láureas de Garrafão Emborrachadas	\N	Emborrachados	geral	30.00	20.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
25	Patrulheiro Emborrachado	\N	Emborrachados	geral	25.00	20.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
22	Polícia Militar Emborrachado para as Costas	\N	Emborrachados	geral	40.00	30.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
27	Trânsito Urbano	\N	Emborrachados	geral	25.00	20.00	1	\N	0	f	f	t	2026-08-01 01:36:14.359706-03
2	Agasalho — CB	\N	Uniformes	cb	150.00	130.00	1	\N	0	f	t	t	2026-08-01 01:36:14.359706-03
1	Agasalho — SD	\N	Uniformes	sd	150.00	130.00	1	\N	0	f	t	t	2026-08-01 01:36:14.359706-03
3	Agasalho — SGT	\N	Uniformes	sgt	150.00	130.00	1	\N	0	f	t	t	2026-08-01 01:36:14.359706-03
7	Camiseta Cinza	\N	Uniformes	geral	50.00	40.00	1	\N	0	f	t	t	2026-08-01 01:36:14.359706-03
5	Camiseta de Educação Física — CB	\N	Uniformes	cb	40.00	32.00	1	\N	0	f	t	t	2026-08-01 01:36:14.359706-03
4	Camiseta de Educação Física — SD	\N	Uniformes	sd	40.00	32.00	1	\N	0	f	t	t	2026-08-01 01:36:14.359706-03
6	Camiseta de Educação Física — SGT	\N	Uniformes	sgt	40.00	32.00	1	\N	0	f	t	t	2026-08-01 01:36:14.359706-03
11	Short Térmico	\N	Uniformes	geral	35.00	30.00	1	\N	0	f	t	t	2026-08-01 01:36:14.359706-03
9	Short de Educação Física — CB	\N	Uniformes	cb	35.00	30.00	1	\N	0	f	t	t	2026-08-01 01:36:14.359706-03
8	Short de Educação Física — SD	\N	Uniformes	sd	35.00	30.00	1	\N	0	f	t	t	2026-08-01 01:36:14.359706-03
10	Short de Educação Física — SGT	\N	Uniformes	sgt	35.00	30.00	1	\N	0	f	t	t	2026-08-01 01:36:14.359706-03
13	Sunga Box — CB	\N	Uniformes	cb	50.00	40.00	1	\N	0	f	t	t	2026-08-01 01:36:14.359706-03
15	Sunga Box — Oficiais	\N	Uniformes	geral	50.00	40.00	1	\N	0	f	t	t	2026-08-01 01:36:14.359706-03
12	Sunga Box — SD	\N	Uniformes	sd	50.00	40.00	1	\N	0	f	t	t	2026-08-01 01:36:14.359706-03
14	Sunga Box — SGT	\N	Uniformes	sgt	50.00	40.00	1	\N	0	f	t	t	2026-08-01 01:36:14.359706-03
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usuarios (id, nome, email, senha_hash, telefone, patente, administrador, created_at) FROM stdin;
\.


--
-- Name: pedido_itens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pedido_itens_id_seq', 1, false);


--
-- Name: pedidos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pedidos_id_seq', 1, false);


--
-- Name: produtos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.produtos_id_seq', 72, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 1, false);


--
-- Name: pedido_itens pedido_itens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido_itens
    ADD CONSTRAINT pedido_itens_pkey PRIMARY KEY (id);


--
-- Name: pedidos pedidos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_pkey PRIMARY KEY (id);


--
-- Name: produtos produtos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT produtos_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: idx_pedido_itens_pedido; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pedido_itens_pedido ON public.pedido_itens USING btree (pedido_id);


--
-- Name: idx_pedidos_usuario; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pedidos_usuario ON public.pedidos USING btree (usuario_id);


--
-- Name: idx_produtos_ativo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_produtos_ativo ON public.produtos USING btree (ativo);


--
-- Name: idx_produtos_categoria; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_produtos_categoria ON public.produtos USING btree (categoria);


--
-- Name: idx_produtos_patente; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_produtos_patente ON public.produtos USING btree (patente);


--
-- Name: pedido_itens fk_itens_pedido; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido_itens
    ADD CONSTRAINT fk_itens_pedido FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id) ON DELETE CASCADE;


--
-- Name: pedido_itens fk_itens_produto; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido_itens
    ADD CONSTRAINT fk_itens_produto FOREIGN KEY (produto_id) REFERENCES public.produtos(id) ON DELETE SET NULL;


--
-- Name: pedidos fk_pedidos_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT fk_pedidos_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict wzJDiu7wc9A6DURXXN5z6RFyEu3fuE2enbzZJTSjhsbW2B3wcW50yQYaPkyLW0x

