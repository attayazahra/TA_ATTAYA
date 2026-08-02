--
-- CURRENT_USERQL database dump
--

-- \restrict gsQEw1zVzf8ZmdVIo1PTE3LWMK3hTSc1hDBFt2tqYaMK1fWoW0conDyQMPm5GeX

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-08-02 21:05:48

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 234 (class 1259 OID 16476)
-- Name: admins; Type: TABLE; Schema: public; Owner: CURRENT_USER
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    name character varying(100),
    email character varying(100),
    picture text,
    login_type character varying(20) DEFAULT 'manual'::character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    reset_token character varying(255),
    token_expiry timestamp with time zone
);


ALTER TABLE public.admins OWNER TO CURRENT_USER;

--
-- TOC entry 233 (class 1259 OID 16475)
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: CURRENT_USER
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admins_id_seq OWNER TO CURRENT_USER;

--
-- TOC entry 5080 (class 0 OID 0)
-- Dependencies: 233
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: CURRENT_USER
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- TOC entry 224 (class 1259 OID 16417)
-- Name: aturan_rekomendasis; Type: TABLE; Schema: public; Owner: CURRENT_USER
--

CREATE TABLE public.aturan_rekomendasis (
    id integer NOT NULL,
    ruangan character varying(50) NOT NULL,
    suasana character varying(50) NOT NULL,
    warna_rekomendasi text NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.aturan_rekomendasis OWNER TO CURRENT_USER;

--
-- TOC entry 223 (class 1259 OID 16416)
-- Name: aturan_rekomendasis_id_seq; Type: SEQUENCE; Schema: public; Owner: CURRENT_USER
--

CREATE SEQUENCE public.aturan_rekomendasis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.aturan_rekomendasis_id_seq OWNER TO CURRENT_USER;

--
-- TOC entry 5081 (class 0 OID 0)
-- Dependencies: 223
-- Name: aturan_rekomendasis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: CURRENT_USER
--

ALTER SEQUENCE public.aturan_rekomendasis_id_seq OWNED BY public.aturan_rekomendasis.id;


--
-- TOC entry 222 (class 1259 OID 16403)
-- Name: hargas; Type: TABLE; Schema: public; Owner: CURRENT_USER
--

CREATE TABLE public.hargas (
    id integer NOT NULL,
    jenis character varying(50) NOT NULL,
    harga_per_kg bigint,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.hargas OWNER TO CURRENT_USER;

--
-- TOC entry 239 (class 1259 OID 16585)
-- Name: hargas_backup_20260628; Type: TABLE; Schema: public; Owner: CURRENT_USER
--

CREATE TABLE public.hargas_backup_20260628 (
    id integer,
    jenis character varying(50),
    harga bigint,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.hargas_backup_20260628 OWNER TO CURRENT_USER;

--
-- TOC entry 221 (class 1259 OID 16402)
-- Name: hargas_id_seq; Type: SEQUENCE; Schema: public; Owner: CURRENT_USER
--

CREATE SEQUENCE public.hargas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hargas_id_seq OWNER TO CURRENT_USER;

--
-- TOC entry 5082 (class 0 OID 0)
-- Dependencies: 221
-- Name: hargas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: CURRENT_USER
--

ALTER SEQUENCE public.hargas_id_seq OWNED BY public.hargas.id;


--
-- TOC entry 232 (class 1259 OID 16465)
-- Name: riwayat_admins; Type: TABLE; Schema: public; Owner: CURRENT_USER
--

CREATE TABLE public.riwayat_admins (
    id integer NOT NULL,
    admin_id bigint,
    admin_name text,
    aktivitas text,
    detail text,
    created_at timestamp without time zone
);


ALTER TABLE public.riwayat_admins OWNER TO CURRENT_USER;

--
-- TOC entry 231 (class 1259 OID 16464)
-- Name: riwayat_admins_id_seq; Type: SEQUENCE; Schema: public; Owner: CURRENT_USER
--

CREATE SEQUENCE public.riwayat_admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.riwayat_admins_id_seq OWNER TO CURRENT_USER;

--
-- TOC entry 5083 (class 0 OID 0)
-- Dependencies: 231
-- Name: riwayat_admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: CURRENT_USER
--

ALTER SEQUENCE public.riwayat_admins_id_seq OWNED BY public.riwayat_admins.id;


--
-- TOC entry 226 (class 1259 OID 16434)
-- Name: riwayat_kalkulators; Type: TABLE; Schema: public; Owner: CURRENT_USER
--

CREATE TABLE public.riwayat_kalkulators (
    id integer NOT NULL,
    session_id text,
    panjang numeric(5,2),
    lebar numeric(5,2),
    tinggi numeric(5,2),
    jumlah_pintu bigint,
    lebar_pintu numeric(5,2),
    tinggi_pintu numeric(5,2),
    jumlah_jendela bigint,
    lebar_jendela numeric(5,2),
    tinggi_jendela numeric(5,2),
    lapisan bigint,
    jenis_cat text,
    kebutuhan_kg numeric(8,2),
    estimasi_biaya numeric(12,2),
    created_at timestamp without time zone,
    kode_aktivitas text
);


ALTER TABLE public.riwayat_kalkulators OWNER TO CURRENT_USER;

--
-- TOC entry 225 (class 1259 OID 16433)
-- Name: riwayat_kalkulators_id_seq; Type: SEQUENCE; Schema: public; Owner: CURRENT_USER
--

CREATE SEQUENCE public.riwayat_kalkulators_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.riwayat_kalkulators_id_seq OWNER TO CURRENT_USER;

--
-- TOC entry 5084 (class 0 OID 0)
-- Dependencies: 225
-- Name: riwayat_kalkulators_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: CURRENT_USER
--

ALTER SEQUENCE public.riwayat_kalkulators_id_seq OWNED BY public.riwayat_kalkulators.id;


--
-- TOC entry 230 (class 1259 OID 16454)
-- Name: riwayat_rekomendasis; Type: TABLE; Schema: public; Owner: CURRENT_USER
--

CREATE TABLE public.riwayat_rekomendasis (
    id integer NOT NULL,
    session_id text,
    jenis_ruangan text,
    suasana text,
    warna_direkomendasikan text,
    warna_dipilih text,
    created_at timestamp without time zone,
    kode_aktivitas text,
    jenis_cat_id bigint,
    jenis_cat_nama text
);


ALTER TABLE public.riwayat_rekomendasis OWNER TO CURRENT_USER;

--
-- TOC entry 229 (class 1259 OID 16453)
-- Name: riwayat_rekomendasis_id_seq; Type: SEQUENCE; Schema: public; Owner: CURRENT_USER
--

CREATE SEQUENCE public.riwayat_rekomendasis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.riwayat_rekomendasis_id_seq OWNER TO CURRENT_USER;

--
-- TOC entry 5085 (class 0 OID 0)
-- Dependencies: 229
-- Name: riwayat_rekomendasis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: CURRENT_USER
--

ALTER SEQUENCE public.riwayat_rekomendasis_id_seq OWNED BY public.riwayat_rekomendasis.id;


--
-- TOC entry 228 (class 1259 OID 16443)
-- Name: riwayat_simulasis; Type: TABLE; Schema: public; Owner: CURRENT_USER
--

CREATE TABLE public.riwayat_simulasis (
    id integer NOT NULL,
    session_id text,
    created_at timestamp without time zone,
    warna_akhir text,
    warna_dicoba text,
    kode_aktivitas text,
    foto_path text,
    warna_dibandingkan text
);


ALTER TABLE public.riwayat_simulasis OWNER TO CURRENT_USER;

--
-- TOC entry 227 (class 1259 OID 16442)
-- Name: riwayat_simulasis_id_seq; Type: SEQUENCE; Schema: public; Owner: CURRENT_USER
--

CREATE SEQUENCE public.riwayat_simulasis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.riwayat_simulasis_id_seq OWNER TO CURRENT_USER;

--
-- TOC entry 5086 (class 0 OID 0)
-- Dependencies: 227
-- Name: riwayat_simulasis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: CURRENT_USER
--

ALTER SEQUENCE public.riwayat_simulasis_id_seq OWNED BY public.riwayat_simulasis.id;


--
-- TOC entry 237 (class 1259 OID 16561)
-- Name: sessions; Type: TABLE; Schema: public; Owner: CURRENT_USER
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    session_id character varying(20) NOT NULL,
    created_at timestamp without time zone
);


ALTER TABLE public.sessions OWNER TO CURRENT_USER;

--
-- TOC entry 236 (class 1259 OID 16560)
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: CURRENT_USER
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sessions_id_seq OWNER TO CURRENT_USER;

--
-- TOC entry 5087 (class 0 OID 0)
-- Dependencies: 236
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: CURRENT_USER
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- TOC entry 220 (class 1259 OID 16386)
-- Name: warnas; Type: TABLE; Schema: public; Owner: CURRENT_USER
--

CREATE TABLE public.warnas (
    id integer NOT NULL,
    nomor_seri character varying(50),
    nama character varying(100) NOT NULL,
    kode_hex character varying(7) CONSTRAINT warnas_kode_not_null NOT NULL,
    kategori character varying(50) NOT NULL,
    tersedia boolean DEFAULT true,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.warnas OWNER TO CURRENT_USER;

--
-- TOC entry 235 (class 1259 OID 16511)
-- Name: warnas_backup; Type: TABLE; Schema: public; Owner: CURRENT_USER
--

CREATE TABLE public.warnas_backup (
    id integer,
    nomor character varying(10),
    nama character varying(100),
    kode character varying(7),
    kategori character varying(50),
    tersedia boolean,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.warnas_backup OWNER TO CURRENT_USER;

--
-- TOC entry 238 (class 1259 OID 16582)
-- Name: warnas_backup_20260628; Type: TABLE; Schema: public; Owner: CURRENT_USER
--

CREATE TABLE public.warnas_backup_20260628 (
    id integer,
    nomor character varying(10),
    nama character varying(100),
    kode character varying(7),
    kategori character varying(50),
    tersedia boolean,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.warnas_backup_20260628 OWNER TO CURRENT_USER;

--
-- TOC entry 219 (class 1259 OID 16385)
-- Name: warnas_id_seq; Type: SEQUENCE; Schema: public; Owner: CURRENT_USER
--

CREATE SEQUENCE public.warnas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.warnas_id_seq OWNER TO CURRENT_USER;

--
-- TOC entry 5088 (class 0 OID 0)
-- Dependencies: 219
-- Name: warnas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: CURRENT_USER
--

ALTER SEQUENCE public.warnas_id_seq OWNED BY public.warnas.id;


--
-- TOC entry 4869 (class 2604 OID 16479)
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- TOC entry 4864 (class 2604 OID 16420)
-- Name: aturan_rekomendasis id; Type: DEFAULT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.aturan_rekomendasis ALTER COLUMN id SET DEFAULT nextval('public.aturan_rekomendasis_id_seq'::regclass);


--
-- TOC entry 4863 (class 2604 OID 16406)
-- Name: hargas id; Type: DEFAULT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.hargas ALTER COLUMN id SET DEFAULT nextval('public.hargas_id_seq'::regclass);


--
-- TOC entry 4868 (class 2604 OID 16468)
-- Name: riwayat_admins id; Type: DEFAULT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.riwayat_admins ALTER COLUMN id SET DEFAULT nextval('public.riwayat_admins_id_seq'::regclass);


--
-- TOC entry 4865 (class 2604 OID 16437)
-- Name: riwayat_kalkulators id; Type: DEFAULT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.riwayat_kalkulators ALTER COLUMN id SET DEFAULT nextval('public.riwayat_kalkulators_id_seq'::regclass);


--
-- TOC entry 4867 (class 2604 OID 16457)
-- Name: riwayat_rekomendasis id; Type: DEFAULT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.riwayat_rekomendasis ALTER COLUMN id SET DEFAULT nextval('public.riwayat_rekomendasis_id_seq'::regclass);


--
-- TOC entry 4866 (class 2604 OID 16446)
-- Name: riwayat_simulasis id; Type: DEFAULT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.riwayat_simulasis ALTER COLUMN id SET DEFAULT nextval('public.riwayat_simulasis_id_seq'::regclass);


--
-- TOC entry 4871 (class 2604 OID 16564)
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- TOC entry 4861 (class 2604 OID 16389)
-- Name: warnas id; Type: DEFAULT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.warnas ALTER COLUMN id SET DEFAULT nextval('public.warnas_id_seq'::regclass);


--
-- TOC entry 5069 (class 0 OID 16476)
-- Dependencies: 234
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: CURRENT_USER
--

COPY public.admins (id, username, password, name, email, picture, login_type, created_at, updated_at, reset_token, token_expiry) FROM stdin;
1	admin	$2a$10$nlX9uSQMZSDnqlJiszaY0eIW5iH86IARW52rosYVgguCo6rxkPZQu	Administrator	grecyedl@gmail.com		manual	2026-07-10 12:53:07.477862	2026-08-02 19:15:22.020482		\N
\.


--
-- TOC entry 5059 (class 0 OID 16417)
-- Dependencies: 224
-- Data for Name: aturan_rekomendasis; Type: TABLE DATA; Schema: public; Owner: CURRENT_USER
--

COPY public.aturan_rekomendasis (id, ruangan, suasana, warna_rekomendasi, created_at, updated_at) FROM stdin;
22	Kamar Tidur	Calming	Biru Langit, Baby Blue, Sky Blue, Powder Blue, Soft Lavender	2026-07-09 10:14:07.557731	2026-07-09 10:14:07.559054
23	Kamar Tidur	Romantic	Salmon Peach, Bubble Gum, Medium Pink, Peach Blush, Light Pink, Pastel Pink, Blush Pink	2026-07-09 10:14:07.557731	2026-07-09 10:14:07.559054
24	Kamar Tidur	Energetic	Cheery Red, Magenta Pink, Rose Red	2026-07-09 10:14:07.557731	2026-07-09 10:14:07.559054
25	Kamar Tidur	Cozy	Terracotta, Amber Gold, Warm Beige, Soft Apricot	2026-07-09 10:14:07.557731	2026-07-09 10:14:07.559054
43	Ruang Tamu	Minimalis	["Putih","Krem","Abu-abu"]	2026-06-30 15:33:18.204801	2026-06-30 15:33:18.204801
26	Ruang Tamu	Elegant	Wine, Khaki, Charcoal	2026-07-09 10:14:07.557731	2026-07-09 10:14:07.559054
27	Ruang Tamu	Warm	Golden Brown, Terracotta, Golden Sand, Ivory Cream	2026-07-09 10:14:07.557731	2026-07-09 10:14:07.559054
28	Ruang Tamu	Fresh	Light Green, Mint, Seafoam, Soft Mint	2026-07-09 10:14:07.557731	2026-07-09 10:14:07.559054
29	Ruang Tamu	Modern	Charcoal, Light Gray, Slate Gray, Cool White	2026-07-09 10:14:07.557731	2026-07-09 10:14:07.559054
30	Dapur	Clean	Cool White, Off White, Soft White, Cream, Ivory	2026-07-09 10:14:07.557731	2026-07-09 10:14:07.559054
31	Dapur	Fresh	Celery, Dusty Blue, Apple Green, Fresh Green, Mint	2026-07-09 10:14:07.557731	2026-07-09 10:14:07.559054
32	Dapur	Warm	Golden Yellow, Amber Gold, Soft Lemon, Vanilla Cream	2026-07-09 10:14:07.557731	2026-07-09 10:14:07.559054
33	Dapur	Modern	Medium Gray, Titanium, Taupe Gray, Golden Brown	2026-07-09 10:14:07.557731	2026-07-09 10:14:07.559054
34	Ruang Kerja	Fokus	Royal Blue, Cobalt Blue, Deep Charcoal, Medium Gray	2026-07-09 10:14:07.557731	2026-07-09 10:14:07.559054
35	Ruang Kerja	Fresh	Mint, Seafoam, Soft Mint, Ice Blue	2026-07-09 10:14:07.557731	2026-07-09 10:14:07.559054
36	Ruang Kerja	Minimalis	Off White, Soft White, Light Gray, Cool White, Soft Gray	2026-07-09 10:14:07.557731	2026-07-09 10:14:07.559054
37	Kamar Anak	Ceria	Golden Yellow, Soft Lemon, Orange, Candy Pink, Sky Blue	2026-07-09 10:14:07.557731	2026-07-09 10:14:07.559054
38	Kamar Anak	Calming	Salmon Peach, Ivory, Apricot Cream, Peach Blush, Blush Pink	2026-07-09 10:14:07.557731	2026-07-09 10:14:07.559054
39	Kamar Anak	Playful	Bubble Gum, Pastel Pink, Light Pink, Sky Blue, Aqua Blue, Aquamarine	2026-07-09 10:14:07.557731	2026-07-09 10:14:07.559054
40	Kamar Mandi	Clean	Cool White, Off White, Soft White, Cream, Ivory	2026-07-09 10:14:07.557731	2026-07-09 10:14:07.559054
41	Kamar Mandi	Fresh	Aqua Blue, Sky Blue, Mint, Seafoam, Ice Blue	2026-07-09 10:14:07.557731	2026-07-09 10:14:07.559054
42	Kamar Mandi	Modern	Light Gray, Soft Gray, Silver, Titanium, Cool White	2026-07-09 10:14:07.557731	2026-07-09 10:14:07.559054
\.


--
-- TOC entry 5057 (class 0 OID 16403)
-- Dependencies: 222
-- Data for Name: hargas; Type: TABLE DATA; Schema: public; Owner: CURRENT_USER
--

COPY public.hargas (id, jenis, harga_per_kg, created_at, updated_at) FROM stdin;
5	Emas	90000	0001-01-01 00:00:00	2026-06-22 08:08:18.167329
2	Pro	17000	0001-01-01 00:00:00	2026-07-03 17:55:26.291578
4	Multi Doff	28000	0001-01-01 00:00:00	2026-06-22 07:40:05.981795
1	Multi Gloss	37000	0001-01-01 00:00:00	2026-06-22 09:43:22.55705
3	Super	20000	0001-01-01 00:00:00	2026-07-11 16:03:07.903252
\.


--
-- TOC entry 5074 (class 0 OID 16585)
-- Dependencies: 239
-- Data for Name: hargas_backup_20260628; Type: TABLE DATA; Schema: public; Owner: CURRENT_USER
--

COPY public.hargas_backup_20260628 (id, jenis, harga, created_at, updated_at) FROM stdin;
3	Super	18000	\N	\N
2	Pro	14000	0001-01-01 00:00:00	2026-06-21 21:34:57.850538
4	Multi Doff	26000	0001-01-01 00:00:00	2026-06-22 07:40:05.981795
5	Emas	90000	0001-01-01 00:00:00	2026-06-22 08:08:18.167329
1	Multi Gloss	33000	0001-01-01 00:00:00	2026-06-22 09:43:22.55705
\.


--
-- TOC entry 5067 (class 0 OID 16465)
-- Dependencies: 232
-- Data for Name: riwayat_admins; Type: TABLE DATA; Schema: public; Owner: CURRENT_USER
--

COPY public.riwayat_admins (id, admin_id, admin_name, aktivitas, detail, created_at) FROM stdin;
1	1	Admin Test	Test Postman	Ini adalah test riwayat dari Postman	2026-06-22 07:21:37.23223
119	1	Administrator	Login	Login menggunakan MANUAL (username: admin)	2026-07-12 08:20:01.790024
120	1	Administrator	Edit Warna	Mengubah warna "Fire Orange" (G.01) menjadi "Fire Orange" (G.01)	2026-07-12 08:20:22.131321
121	1	Administrator	Tambah Warna	Menambah warna "Abu monyet" (Z.01)	2026-07-12 08:21:03.233787
125	1	Administrator	Login	Login menggunakan MANUAL (username: admin)	2026-07-15 09:42:40.523503
127	1	Administrator	Login	Login menggunakan MANUAL (username: admin)	2026-07-15 11:03:33.389245
129	1	Administrator	Login	Login menggunakan MANUAL (username: admin)	2026-07-15 11:43:10.045623
131	1	Administrator	Reset Password	Password berhasil direset melalui link forgot password	2026-07-28 14:01:56.759071
132	1	Administrator	Login	Login menggunakan MANUAL (username: admin)	2026-07-28 14:02:14.491252
46	1	Administrator	Hapus Aturan	Menghapus aturan "Kamar Anak - Calming"	2026-06-25 01:50:24.951673
66	1	Administrator	Tambah Aturan	Menambah aturan "Kamar Anak - Playful" dengan 5 warna	2026-06-25 02:27:35.014837
70	1	Administrator	Edit Aturan	Mengubah aturan "Kamar Tidur - Cozy" dengan 4 warna	2026-06-25 02:39:01.48039
122	1	Administrator	Ubah Profil	Mengubah foto profil	2026-07-12 08:22:21.360052
123	1	Administrator	Ubah Profil	Mengubah nama profil dari "Administrator" menjadi "Attaya"	2026-07-12 08:22:30.514198
124	1	Admin	Logout	Logout dari sistem	2026-07-12 08:22:37.492618
126	1	Administrator	Login	Login menggunakan MANUAL (username: admin)	2026-07-15 10:35:48.599738
128	1	Administrator	Login	Login menggunakan MANUAL (username: admin)	2026-07-15 11:25:04.946595
130	1	Admin	Logout	Logout dari sistem	2026-07-15 11:52:24.535016
133	1	Administrator	Login	Login menggunakan MANUAL (username: admin)	2026-08-02 19:15:22.055313
102	1	Administrator	Reset Password	Password berhasil direset melalui link forgot password	2026-07-07 01:04:02.128375
109	1	Administrator	Tambah Warna	Menambah warna "Olivia Rodrigo" (M.10)	2026-07-11 15:51:48.657962
110	1	Administrator	Edit Warna	Mengubah warna "Olivia Rodrigo" (M.10) menjadi "Olivia Rodrigo" (M.10)	2026-07-11 16:01:59.903799
112	1	Administrator	Ubah Harga	Mengubah harga Super menjadi Rp 20.000/kg	2026-07-11 16:03:07.914879
117	1	Admin	Logout	Logout dari sistem	2026-07-11 16:23:03.446519
118	1	Administrator	Login	Login menggunakan MANUAL (username: admin)	2026-07-11 16:23:10.731477
\.


--
-- TOC entry 5061 (class 0 OID 16434)
-- Dependencies: 226
-- Data for Name: riwayat_kalkulators; Type: TABLE DATA; Schema: public; Owner: CURRENT_USER
--

COPY public.riwayat_kalkulators (id, session_id, panjang, lebar, tinggi, jumlah_pintu, lebar_pintu, tinggi_pintu, jumlah_jendela, lebar_jendela, tinggi_jendela, lapisan, jenis_cat, kebutuhan_kg, estimasi_biaya, created_at, kode_aktivitas) FROM stdin;
1	S-636536	3.00	3.00	3.00	-1	0.90	2.00	1	1.20	1.50	2	Pro	7.92	160000.00	2026-07-10 02:10:54.931313	KAL/20260710/007
2	S-636536	4.00	4.00	2.90	1	0.90	1.90	2	1.20	1.50	3	Multi Doff	13.56	364000.00	2026-07-10 02:11:56.045096	KAL/20260710/007
3	S-636536	5.00	3.50	3.00	1	0.90	2.00	2	1.20	1.50	2	Pro	10.03	220000.00	2026-07-10 11:39:47.14058	KAL/20260710/007
4	S-636536	8.00	4.00	2.90	1	0.90	2.00	1	1.00	1.20	2	Multi Gloss	14.65	495000.00	2026-07-10 11:41:14.4949	KAL/20260710/007
5	S-636536	4.00	5.00	2.90	1	0.90	1.90	0	1.10	1.50	2	Pro	11.11	240000.00	2026-07-10 11:41:52.249331	KAL/20260710/007
6	S-733767	3.00	4.00	2.00	1	0.80	2.00	1	1.10	1.30	2	Pro	5.49	120000.00	2026-07-10 11:44:28.400265	KAL/20260710/007
7	S-733767	2.00	2.00	1.00	1	0.80	0.00	1	2.00	1.50	2	Pro	1.10	40000.00	2026-07-10 11:45:18.96604	KAL/20260710/007
8	S-880451	4.00	5.00	2.90	1	0.90	2.00	0	1.10	1.30	2	Super	11.09	240000.00	2026-07-10 11:47:33.787429	KAL/20260710/007
9	S-880451	4.50	4.50	3.00	1	0.90	2.00	2	0.90	1.90	2	Super	10.73	220000.00	2026-07-10 11:49:11.229037	KAL/20260710/007
10	S-880451	8.00	4.00	2.00	1	0.90	2.00	1	1.10	1.40	2	Pro	9.83	200000.00	2026-07-10 11:50:27.780355	KAL/20260710/007
11	S-362265	4.00	5.00	3.00	1	0.90	2.00	2	1.20	1.40	1	Pro	5.37	102000.00	2026-07-12 08:14:40.590168	KAL/20260712/007
\.


--
-- TOC entry 5065 (class 0 OID 16454)
-- Dependencies: 230
-- Data for Name: riwayat_rekomendasis; Type: TABLE DATA; Schema: public; Owner: CURRENT_USER
--

COPY public.riwayat_rekomendasis (id, session_id, jenis_ruangan, suasana, warna_direkomendasikan, warna_dipilih, created_at, kode_aktivitas, jenis_cat_id, jenis_cat_nama) FROM stdin;
1	guest-1782097772031	Kamar Tidur	Calming	["Mint Ice","Seafoam","Ivory","Peach Blush","Soft Mint"]	Seafoam	2026-07-03 02:00:10.247499	REK/20260703/001	\N	\N
2	guest-1782097772031	Dapur	Clean	["Off White","Cream","Ivory","Cool White","Soft White"]	Off White, Ivory	2026-07-03 02:01:08.853999	REK/20260703/002	\N	\N
3	guest-1782097772031	Ruang Tamu	Modern	["Charcoal","Cool White","Off White","Slate Grey","Titanium"]	Titanium, Cool White	2026-07-03 02:02:10.692001	REK/20260703/003	\N	\N
4	guest-1782097772031	Dapur	Clean	["Off White","Cream","Ivory","Cool White","Soft White"]	Ivory	2026-07-04 22:26:36.783261	REK/20260704/001	\N	\N
5	guest-1782097772031	Kamar Mandi	Fresh	["Sky Blue","Seafoam","Mint","Aqua Blue","Ice Blue"]	Ice Blue	2026-07-04 22:27:37.380428	REK/20260704/002	\N	\N
6	S-362265	Kamar Tidur	Calming	["Sky Blue","Baby Blue","Powder Blue","Soft Lavender","Soft Cream"]	Powder Blue, Soft Cream	2026-07-09 13:44:45.437589	REK/20260709/007	\N	\N
7	S-362265	Kamar Anak	Calming	["Salmon Peach","Ivory","Peach Blush","Apricot Cream","Blush Pink"]	Blush Pink	2026-07-09 14:15:00.028324	REK/20260709/012	\N	\N
8	S-362265	garasi	Calming	["Light Stone","Warm Taupe","Warm Ivory","Turquoise","Slate Grey"]	Slate Grey	2026-07-11 04:34:41.34865	REK/20260711/007	\N	\N
9	S-362265	Ruang Makan	Classic	["Sky Blue","Warm Ivory","Deep Royal","Caribbean Blue","Ice Cyan"]	Warm Ivory	2026-07-11 12:35:31.402785	REK/20260711/007	\N	\N
\.


--
-- TOC entry 5063 (class 0 OID 16443)
-- Dependencies: 228
-- Data for Name: riwayat_simulasis; Type: TABLE DATA; Schema: public; Owner: CURRENT_USER
--

COPY public.riwayat_simulasis (id, session_id, created_at, warna_akhir, warna_dicoba, kode_aktivitas, foto_path, warna_dibandingkan) FROM stdin;
5	S-362265	2026-07-09 12:16:27.276626	Salmon Peach	["Salmon Peach"]	SIM/20260709/005	\N	\N
6	S-362265	2026-07-09 12:16:49.875553	Salmon Peach	["Salmon Peach"]	SIM/20260709/006	\N	\N
8	S-362265	2026-07-09 13:45:36.289075	Celery	["Celery"]	SIM/20260709/008	\N	\N
9	S-362265	2026-07-09 13:45:48.768707	Celery	["Celery"]	SIM/20260709/009	\N	\N
10	S-362265	2026-07-09 13:45:52.644482	Light Lavender	["Celery","Light Lavender"]	SIM/20260709/010	\N	\N
11	S-362265	2026-07-09 13:45:58.378417	Light Lavender	["Celery","Light Lavender"]	SIM/20260709/011	\N	\N
13	S-362265	2026-07-12 08:17:08.460156			SIM/20260712/007		
14	S-265361	2026-07-16 02:28:16.226687			SIM/20260716/008		
15	S-265361	2026-07-16 02:29:29.150972			SIM/20260716/009		
\.


--
-- TOC entry 5072 (class 0 OID 16561)
-- Dependencies: 237
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: CURRENT_USER
--

COPY public.sessions (id, session_id, created_at) FROM stdin;
1	S-878250	2026-07-09 10:51:54.105588
2	S-524362	2026-07-09 11:21:40.74307
3	S-346707	2026-07-09 11:23:05.812624
4	S-362265	2026-07-09 11:25:01.292032
5	S-636536	2026-07-10 02:10:54.774277
6	S-733767	2026-07-10 11:44:28.37519
7	S-880451	2026-07-10 11:47:33.728416
8	S-265361	2026-07-16 02:28:16.102469
9	guest-1782097772031	2026-07-29 11:37:12.561528
\.


--
-- TOC entry 5055 (class 0 OID 16386)
-- Dependencies: 220
-- Data for Name: warnas; Type: TABLE DATA; Schema: public; Owner: CURRENT_USER
--

COPY public.warnas (id, nomor_seri, nama, kode_hex, kategori, tersedia, created_at, updated_at) FROM stdin;
140	M.10	Olivia Rodrigo	#ffccf1	Pink	f	0001-01-01 00:00:00	2026-07-11 16:01:59.87807
1	G.01	Fire Orange	#D97A4B	Merah	f	0001-01-01 00:00:00	2026-07-12 08:20:22.121244
2	G.02	Salmon Peach	#E7B7A2	Coral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
3	G.03	Golden Apricot	#F2D36B	Kuning	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
4	G.04	Pastel Yellow	#F7E37A	Kuning	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
5	G.05	Celery	#B8D86B	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
6	G.06	Kiwi	#8DD65B	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
7	G.07	Apple Green	#73CB54	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
8	G.08	Kelly Green	#5CB94A	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
9	G.09	Forest Green	#3E8D45	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
10	G.10	Light Lavender	#C8C0E9	Ungu	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
11	G.11	Periwinkle	#8886D8	Ungu	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
12	G.12	Royal Blue	#3549B6	Biru	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
123	D.123	Jet Black	#151515	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
125	D.125	Golden Ochre	#D5A145	Kuning	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
126	D.126	Peach Sand	#EBC59A	Coral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
127	D.127	Ivory Cream	#EFE1B9	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
13	G.13	Cobalt Blue	#2153C9	Biru	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
14	G.14	Sky Blue	#48A6E8	Biru	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
15	G.15	Baby Blue	#8CC9F3	Biru	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
16	G.16	Off White	#F6F6F6	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
18	G.18	Mint Ice	#C7F0E5	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
19	G.19	Caribbean Blue	#38BFE3	Biru	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
20	G.20	Seafoam	#C8E8C5	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
21	G.21	Teal	#2BB9A8	Biru	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
22	G.22	Bubble Gum	#F7A4CB	Pink	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
23	G.23	Medium Pink	#F06AB6	Pink	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
24	G.24	Magenta Pink	#D8448E	Pink	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
25	G.25	Cheery Red	#C93A2E	Merah	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
26	G.26	Brick Red	#9D3437	Merah	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
27	G.27	Wine	#6F2C2A	Merah	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
28	G.28	Burgundy	#43282A	Merah	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
29	G.29	Chocolate	#70543A	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
30	G.30	Terracotta	#C67A4A	Orange	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
31	G.31	Amber Gold	#D8AF4D	Kuning	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
32	G.32	Cream	#EBD8B5	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
33	G.33	Ivory	#F0E4CF	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
35	G.35	Light Silver	#D8D8D4	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
36	G.36	Khaki	#8D7B63	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
37	G.37	Silver	#C9CBCD	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
38	G.38	Titanium	#9A9DA2	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
39	G.39	Charcoal	#555C63	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
40	G.40	Olive	#5D7C36	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
41	G.41	Peach Blush	#F0D1C3	Pink	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
42	G.42	Mint White	#E7F5E3	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
43	G.43	Plum	#68297A	Ungu	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
44	G.44	Soft Mint	#E7F5E3	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
45	P.45	Apricot Cream	#E9C8AB	Coral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
46	P.46	Soft Yellow	#EED87A	Kuning	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
47	P.47	Lemon	#F1E16A	Kuning	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
48	P.48	Light Green	#B9D96B	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
50	P.50	Fresh Green	#63C85D	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
53	P.53	Bright Sky	#45A9EB	Biru	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
55	P.55	Lavender	#C8BEEA	Ungu	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
56	P.56	Soft Pink	#F4B7D3	Pink	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
57	P.57	Pastel Pink	#F8C6D8	Pink	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
58	P.58	Blush Pink	#FAD6D0	Pink	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
59	P.59	Aquamarine	#7FFFD4	Biru	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
60	P.60	Turquoise	#3DC8D2	Biru	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
61	P.61	Light Pink	#F4B7D3	Pink	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
64	P.64	Mint	#C9F1E6	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
65	P.65	Aqua Blue	#55D1E9	Biru	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
69	P.69	Sunset Orange	#D68A54	Orange	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
70	S.70	Golden Brown	#9A7640	Orange	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
71	S.71	Copper Orange	#D77B53	Orange	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
72	S.72	Apricot Orange	#E5A066	Orange	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
73	S.73	Sand Beige	#E8D49A	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
74	S.74	Soft Lemon	#E8DF63	Kuning	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
75	S.75	Golden Yellow	#E7D22D	Kuning	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
76	S.76	Lime Yellow	#C6E34A	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
77	S.77	Fresh Lime	#B5DE5A	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
79	S.79	Spring Green	#84BF55	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
80	S.80	Grass Green	#5DCC43	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
81	S.81	Bright Green	#28B545	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
82	S.82	Green Teal	#20A39A	Biru	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
83	S.83	Sky Cyan	#57CDE0	Biru	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
85	S.85	Rose Red	#D94F72	Pink	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
86	S.86	Rose Pink	#E779B2	Pink	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
87	S.87	Candy Pink	#F29CC7	Pink	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
88	S.88	Baby Pink	#F5B7D3	Pink	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
89	S.89	Ice Cyan	#7CDDE2	Biru	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
91	S.91	Cool White	#E8EDF1	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
92	S.92	Powder Blue	#BFDDF5	Biru	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
94	S.94	Ocean Blue	#3F9BE8	Biru	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
97	S.97	Lavender White	#E7E4F8	Ungu	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
98	S.98	Mint Pastel	#AEE8D6	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
100	S.100	Burnt Orange	#C97037	Orange	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
101	S.101	Warm Ivory	#E4DFD0	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
102	S.102	Light Stone	#C6C7BD	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
128	D.128	Soft Lavender	#9D9AE6	Ungu	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
129	D.129	Warm Beige	#D8C4A5	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
131	D.131	Deep Charcoal	#4B4B4B	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
17	G.17	Light Grey	#E6E8E7	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
130	D.130	Stone Grey	#A8A39B	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
52	P.52	Soft Sky	#7FC8F2	Biru	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
54	P.54	Light Periwinkle	#9B93E8	Ungu	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
62	P.62	Soft Cream	#F3E7C6	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
63	P.63	Warm Ivory	#F7F0DC	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
68	P.68	Dark Charcoal	#4B4746	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
78	S.78	Fresh Apple	#A1D056	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
103	S.103	Mocha Plum	#5C3B43	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
106	S.106	Charcoal Black	#20272E	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
107	S.107	Khaki Beige	#D5C28D	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
108	S.108	Ice Blue	#C8DCE5	Biru	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
109	S.109	Soft White	#E5E5E3	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
110	S.110	Cream Beige	#E6E0D1	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
111	S.111	Golden Sand	#DAB671	Kuning	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
112	S.112	Silver Mist	#D9DDDD	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
113	S.113	Lavender Pink	#F3D8EC	Pink	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
114	S.114	Crimson Red	#D62239	Merah	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
115	S.115	Mint Aqua	#72E0C5	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
116	S.116	Dusty Blue	#7A9FB1	Biru	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
117	S.117	Pale Mint	#D8F0D6	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
118	S.118	Vanilla Cream	#F0E6AF	Kuning	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
119	D.119	Soft Apricot	#E89A6A	Coral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
120	D.120	Golden Mustard	#E2C04C	Kuning	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
122	D.122	Olive Green	#5A8D48	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
34	G.34	Soft Grey	#E8E8E5	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
66	P.66	Warm Grey	#78716B	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
104	S.104	Medium Grey	#8D8D8A	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
105	S.105	Slate Grey	#596068	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
51	P.51	Soft Blue	#A9D7F3	Biru	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
49	P.49	Soft Apple	#A8D76B	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
84	S.84	Rust Terracotta	#B85F3F	Orange	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
90	S.90	Cool Mint	#D8F3EA	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
93	S.93	Clear Sky	#7FC7F5	Biru	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
95	S.95	Deep Royal	#5257D6	Biru	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
96	S.96	Dusty Periwinkle	#8681E6	Ungu	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
99	S.99	Soft Peach	#F3D1C3	Coral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
121	D.121	Zesty Lime	#9DDA6E	Hijau	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
67	P.67	Taupe	#66605C	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
124	D.124	Warm Taupe	#B3ADA6	Netral	t	2026-07-09 10:14:07.485404	2026-07-09 10:14:07.541477
\.


--
-- TOC entry 5070 (class 0 OID 16511)
-- Dependencies: 235
-- Data for Name: warnas_backup; Type: TABLE DATA; Schema: public; Owner: CURRENT_USER
--

COPY public.warnas_backup (id, nomor, nama, kode, kategori, tersedia, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5073 (class 0 OID 16582)
-- Dependencies: 238
-- Data for Name: warnas_backup_20260628; Type: TABLE DATA; Schema: public; Owner: CURRENT_USER
--

COPY public.warnas_backup_20260628 (id, nomor, nama, kode, kategori, tersedia, created_at, updated_at) FROM stdin;
1	G.01	Fire Orange	#D97A4B	Merah	t	\N	\N
2	G.02	Salmon Peach	#E7B7A2	Coral	t	\N	\N
3	G.03	Golden Apricot	#F2D36B	Kuning	t	\N	\N
4	G.04	Pastel Yellow	#F7E37A	Kuning	t	\N	\N
5	G.05	Celery	#B8D86B	Hijau	t	\N	\N
6	G.06	Kiwi	#8DD65B	Hijau	t	\N	\N
7	G.07	Apple Green	#73CB54	Hijau	t	\N	\N
8	G.08	Kelly Green	#5CB94A	Hijau	t	\N	\N
9	G.09	Forest Green	#3E8D45	Hijau	t	\N	\N
10	G.10	Light Lavender	#C8C0E9	Ungu	t	\N	\N
11	G.11	Periwinkle	#8886D8	Ungu	t	\N	\N
12	G.12	Royal Blue	#3549B6	Biru	t	\N	\N
13	G.13	Cobalt Blue	#2153C9	Biru	t	\N	\N
14	G.14	Sky Blue	#48A6E8	Biru	t	\N	\N
15	G.15	Baby Blue	#8CC9F3	Biru	t	\N	\N
16	G.16	Off White	#F6F6F6	Netral	t	\N	\N
17	G.17	Light Gray	#E6E8E7	Netral	t	\N	\N
18	G.18	Mint Ice	#C7F0E5	Hijau	t	\N	\N
19	G.19	Caribbean Blue	#38BFE3	Biru	t	\N	\N
20	G.20	Seafoam	#C8E8C5	Hijau	t	\N	\N
21	G.21	Teal	#2BB9A8	Biru	t	\N	\N
22	G.22	Bubble Gum	#F7A4CB	Pink	t	\N	\N
23	G.23	Medium Pink	#F06AB6	Pink	t	\N	\N
24	G.24	Magenta Pink	#D8448E	Pink	t	\N	\N
25	G.25	Cheery Red	#C93A2E	Merah	t	\N	\N
26	G.26	Brick Red	#9D3437	Merah	t	\N	\N
27	G.27	Wine	#6F2C2A	Merah	t	\N	\N
28	G.28	Burgundy	#43282A	Merah	t	\N	\N
29	G.29	Chocolate	#70543A	Netral	t	\N	\N
30	G.30	Terracotta	#C67A4A	Orange	t	\N	\N
31	G.31	Amber Gold	#D8AF4D	Kuning	t	\N	\N
32	G.32	Cream	#EBD8B5	Netral	t	\N	\N
33	G.33	Ivory	#F0E4CF	Netral	t	\N	\N
34	G.34	Soft Gray	#E8E8E5	Netral	t	\N	\N
35	G.35	Light Silver	#D8D8D4	Netral	t	\N	\N
36	G.36	Khaki	#8D7B63	Netral	t	\N	\N
37	G.37	Silver	#C9CBCD	Netral	t	\N	\N
38	G.38	Titanium	#9A9DA2	Netral	t	\N	\N
39	G.39	Charcoal	#555C63	Netral	t	\N	\N
40	G.40	Olive	#5D7C36	Hijau	t	\N	\N
41	G.41	Peach Blush	#F0D1C3	Pink	t	\N	\N
42	G.42	Mint White	#E7F5E3	Hijau	t	\N	\N
43	G.43	Plum	#68297A	Ungu	t	\N	\N
44	G.44	Soft Mint	#E7F5E3	Hijau	t	\N	\N
45	P.45	Apricot Cream	#E9C8AB	Coral	t	\N	\N
46	P.46	Soft Yellow	#EED87A	Kuning	t	\N	\N
47	P.47	Lemon	#F1E16A	Kuning	t	\N	\N
48	P.48	Light Green	#B9D96B	Hijau	t	\N	\N
49	P.49	Apple Green	#A8D76B	Hijau	t	\N	\N
50	P.50	Fresh Green	#63C85D	Hijau	t	\N	\N
51	P.51	Powder Blue	#A9D7F3	Biru	t	\N	\N
52	P.52	Sky Blue	#7FC8F2	Biru	t	\N	\N
53	P.53	Bright Sky	#45A9EB	Biru	t	\N	\N
54	P.54	Periwinkle	#9B93E8	Ungu	t	\N	\N
55	P.55	Lavender	#C8BEEA	Ungu	t	\N	\N
56	P.56	Soft Pink	#F4B7D3	Pink	t	\N	\N
57	P.57	Pastel Pink	#F8C6D8	Pink	t	\N	\N
58	P.58	Blush Pink	#FAD6D0	Pink	t	\N	\N
59	P.59	Aquamarine	#7FFFD4	Biru	t	\N	\N
60	P.60	Turquoise	#3DC8D2	Biru	t	\N	\N
61	P.61	Light Pink	#F4B7D3	Pink	t	\N	\N
62	P.62	Cream	#F3E7C6	Netral	t	\N	\N
63	P.63	Ivory	#F7F0DC	Netral	t	\N	\N
64	P.64	Mint	#C9F1E6	Hijau	t	\N	\N
65	P.65	Aqua Blue	#55D1E9	Biru	t	\N	\N
66	P.66	Warm Gray	#78716B	Netral	t	\N	\N
67	P.67	Taupe Gray	#66605C	Netral	t	\N	\N
68	P.68	Charcoal	#4B4746	Netral	t	\N	\N
69	P.69	Sunset Orange	#D68A54	Orange	t	\N	\N
70	S.70	Golden Brown	#9A7640	Orange	t	\N	\N
71	S.71	Copper Orange	#D77B53	Orange	t	\N	\N
72	S.72	Apricot Orange	#E5A066	Orange	t	\N	\N
73	S.73	Sand Beige	#E8D49A	Netral	t	\N	\N
74	S.74	Soft Lemon	#E8DF63	Kuning	t	\N	\N
75	S.75	Golden Yellow	#E7D22D	Kuning	t	\N	\N
76	S.76	Lime Yellow	#C6E34A	Hijau	t	\N	\N
77	S.77	Fresh Lime	#B5DE5A	Hijau	t	\N	\N
78	S.78	Apple Green	#A1D056	Hijau	t	\N	\N
79	S.79	Spring Green	#84BF55	Hijau	t	\N	\N
80	S.80	Grass Green	#5DCC43	Hijau	t	\N	\N
81	S.81	Bright Green	#28B545	Hijau	t	\N	\N
82	S.82	Green Teal	#20A39A	Biru	t	\N	\N
83	S.83	Sky Cyan	#57CDE0	Biru	t	\N	\N
84	S.84	Terracotta	#B85F3F	Orange	t	\N	\N
85	S.85	Rose Red	#D94F72	Pink	t	\N	\N
86	S.86	Rose Pink	#E779B2	Pink	t	\N	\N
87	S.87	Candy Pink	#F29CC7	Pink	t	\N	\N
88	S.88	Baby Pink	#F5B7D3	Pink	t	\N	\N
89	S.89	Ice Cyan	#7CDDE2	Biru	t	\N	\N
90	S.90	Mint Ice	#D8F3EA	Hijau	t	\N	\N
91	S.91	Cool White	#E8EDF1	Netral	t	\N	\N
92	S.92	Powder Blue	#BFDDF5	Biru	t	\N	\N
93	S.93	Sky Blue	#7FC7F5	Biru	t	\N	\N
94	S.94	Ocean Blue	#3F9BE8	Biru	t	\N	\N
95	S.95	Royal Blue	#5257D6	Biru	t	\N	\N
96	S.96	Periwinkle	#8681E6	Ungu	t	\N	\N
97	S.97	Lavender White	#E7E4F8	Ungu	t	\N	\N
98	S.98	Mint Pastel	#AEE8D6	Hijau	t	\N	\N
99	S.99	Peach Blush	#F3D1C3	Coral	t	\N	\N
100	S.100	Burnt Orange	#C97037	Orange	t	\N	\N
101	S.101	Warm Ivory	#E4DFD0	Netral	t	\N	\N
102	S.102	Light Stone	#C6C7BD	Netral	t	\N	\N
103	S.103	Mocha Plum	#5C3B43	Netral	t	\N	\N
104	S.104	Medium Gray	#8D8D8A	Netral	t	\N	\N
105	S.105	Slate Gray	#596068	Netral	t	\N	\N
106	S.106	Charcoal Black	#20272E	Netral	t	\N	\N
107	S.107	Khaki Beige	#D5C28D	Netral	t	\N	\N
108	S.108	Ice Blue	#C8DCE5	Biru	t	\N	\N
109	S.109	Soft White	#E5E5E3	Netral	t	\N	\N
110	S.110	Cream Beige	#E6E0D1	Netral	t	\N	\N
111	S.111	Golden Sand	#DAB671	Kuning	t	\N	\N
112	S.112	Silver Mist	#D9DDDD	Netral	t	\N	\N
113	S.113	Lavender Pink	#F3D8EC	Pink	t	\N	\N
114	S.114	Crimson Red	#D62239	Merah	t	\N	\N
115	S.115	Mint Aqua	#72E0C5	Hijau	t	\N	\N
116	S.116	Dusty Blue	#7A9FB1	Biru	t	\N	\N
117	S.117	Pale Mint	#D8F0D6	Hijau	t	\N	\N
118	S.118	Vanilla Cream	#F0E6AF	Kuning	t	\N	\N
119	D.119	Soft Apricot	#E89A6A	Coral	t	\N	\N
120	D.120	Golden Mustard	#E2C04C	Kuning	t	\N	\N
121	D.121	Fresh Lime	#9DDA6E	Hijau	t	\N	\N
122	D.122	Olive Green	#5A8D48	Hijau	t	\N	\N
123	D.123	Jet Black	#151515	Netral	t	\N	\N
124	D.124	Taupe Gray	#B3ADA6	Netral	t	\N	\N
125	D.125	Golden Ochre	#D5A145	Kuning	t	\N	\N
126	D.126	Peach Sand	#EBC59A	Coral	t	\N	\N
127	D.127	Ivory Cream	#EFE1B9	Netral	t	\N	\N
128	D.128	Soft Lavender	#9D9AE6	Ungu	t	\N	\N
129	D.129	Warm Beige	#D8C4A5	Netral	t	\N	\N
130	D.130	Stone Gray	#A8A39B	Netral	t	\N	\N
131	D.131	Deep Charcoal	#4B4B4B	Netral	t	\N	\N
\.


--
-- TOC entry 5089 (class 0 OID 0)
-- Dependencies: 233
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: CURRENT_USER
--

SELECT pg_catalog.setval('public.admins_id_seq', 1, true);


--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 223
-- Name: aturan_rekomendasis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: CURRENT_USER
--

SELECT pg_catalog.setval('public.aturan_rekomendasis_id_seq', 43, true);


--
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 221
-- Name: hargas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: CURRENT_USER
--

SELECT pg_catalog.setval('public.hargas_id_seq', 5, true);


--
-- TOC entry 5092 (class 0 OID 0)
-- Dependencies: 231
-- Name: riwayat_admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: CURRENT_USER
--

SELECT pg_catalog.setval('public.riwayat_admins_id_seq', 133, true);


--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 225
-- Name: riwayat_kalkulators_id_seq; Type: SEQUENCE SET; Schema: public; Owner: CURRENT_USER
--

SELECT pg_catalog.setval('public.riwayat_kalkulators_id_seq', 11, true);


--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 229
-- Name: riwayat_rekomendasis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: CURRENT_USER
--

SELECT pg_catalog.setval('public.riwayat_rekomendasis_id_seq', 9, true);


--
-- TOC entry 5095 (class 0 OID 0)
-- Dependencies: 227
-- Name: riwayat_simulasis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: CURRENT_USER
--

SELECT pg_catalog.setval('public.riwayat_simulasis_id_seq', 15, true);


--
-- TOC entry 5096 (class 0 OID 0)
-- Dependencies: 236
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: CURRENT_USER
--

SELECT pg_catalog.setval('public.sessions_id_seq', 9, true);


--
-- TOC entry 5097 (class 0 OID 0)
-- Dependencies: 219
-- Name: warnas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: CURRENT_USER
--

SELECT pg_catalog.setval('public.warnas_id_seq', 141, true);


--
-- TOC entry 4893 (class 2606 OID 16489)
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- TOC entry 4895 (class 2606 OID 16491)
-- Name: admins admins_username_key; Type: CONSTRAINT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_username_key UNIQUE (username);


--
-- TOC entry 4881 (class 2606 OID 16430)
-- Name: aturan_rekomendasis aturan_rekomendasis_pkey; Type: CONSTRAINT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.aturan_rekomendasis
    ADD CONSTRAINT aturan_rekomendasis_pkey PRIMARY KEY (id);


--
-- TOC entry 4883 (class 2606 OID 16432)
-- Name: aturan_rekomendasis aturan_rekomendasis_ruangan_suasana_key; Type: CONSTRAINT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.aturan_rekomendasis
    ADD CONSTRAINT aturan_rekomendasis_ruangan_suasana_key UNIQUE (ruangan, suasana);


--
-- TOC entry 4877 (class 2606 OID 16415)
-- Name: hargas hargas_jenis_key; Type: CONSTRAINT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.hargas
    ADD CONSTRAINT hargas_jenis_key UNIQUE (jenis);


--
-- TOC entry 4879 (class 2606 OID 16413)
-- Name: hargas hargas_pkey; Type: CONSTRAINT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.hargas
    ADD CONSTRAINT hargas_pkey PRIMARY KEY (id);


--
-- TOC entry 4891 (class 2606 OID 16474)
-- Name: riwayat_admins riwayat_admins_pkey; Type: CONSTRAINT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.riwayat_admins
    ADD CONSTRAINT riwayat_admins_pkey PRIMARY KEY (id);


--
-- TOC entry 4885 (class 2606 OID 16441)
-- Name: riwayat_kalkulators riwayat_kalkulators_pkey; Type: CONSTRAINT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.riwayat_kalkulators
    ADD CONSTRAINT riwayat_kalkulators_pkey PRIMARY KEY (id);


--
-- TOC entry 4889 (class 2606 OID 16463)
-- Name: riwayat_rekomendasis riwayat_rekomendasis_pkey; Type: CONSTRAINT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.riwayat_rekomendasis
    ADD CONSTRAINT riwayat_rekomendasis_pkey PRIMARY KEY (id);


--
-- TOC entry 4887 (class 2606 OID 16452)
-- Name: riwayat_simulasis riwayat_simulasis_pkey; Type: CONSTRAINT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.riwayat_simulasis
    ADD CONSTRAINT riwayat_simulasis_pkey PRIMARY KEY (id);


--
-- TOC entry 4900 (class 2606 OID 16569)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 4902 (class 2606 OID 16571)
-- Name: sessions sessions_session_id_key; Type: CONSTRAINT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_session_id_key UNIQUE (session_id);


--
-- TOC entry 4873 (class 2606 OID 16589)
-- Name: warnas warnas_nomor_key; Type: CONSTRAINT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.warnas
    ADD CONSTRAINT warnas_nomor_key UNIQUE (nomor_seri);


--
-- TOC entry 4875 (class 2606 OID 16399)
-- Name: warnas warnas_pkey; Type: CONSTRAINT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.warnas
    ADD CONSTRAINT warnas_pkey PRIMARY KEY (id);


--
-- TOC entry 4896 (class 1259 OID 16579)
-- Name: idx_admins_email; Type: INDEX; Schema: public; Owner: CURRENT_USER
--

CREATE UNIQUE INDEX idx_admins_email ON public.admins USING btree (email);


--
-- TOC entry 4897 (class 1259 OID 16580)
-- Name: idx_admins_reset_token; Type: INDEX; Schema: public; Owner: CURRENT_USER
--

CREATE INDEX idx_admins_reset_token ON public.admins USING btree (reset_token);


--
-- TOC entry 4898 (class 1259 OID 16581)
-- Name: idx_admins_token_expiry; Type: INDEX; Schema: public; Owner: CURRENT_USER
--

CREATE INDEX idx_admins_token_expiry ON public.admins USING btree (token_expiry);


--
-- TOC entry 4906 (class 2606 OID 16711)
-- Name: riwayat_admins fk_riwayat_admins_admin; Type: FK CONSTRAINT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.riwayat_admins
    ADD CONSTRAINT fk_riwayat_admins_admin FOREIGN KEY (admin_id) REFERENCES public.admins(id);


--
-- TOC entry 4903 (class 2606 OID 16696)
-- Name: riwayat_kalkulators fk_riwayat_kalkulators_session; Type: FK CONSTRAINT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.riwayat_kalkulators
    ADD CONSTRAINT fk_riwayat_kalkulators_session FOREIGN KEY (session_id) REFERENCES public.sessions(session_id);


--
-- TOC entry 4905 (class 2606 OID 16706)
-- Name: riwayat_rekomendasis fk_riwayat_rekomendasis_session; Type: FK CONSTRAINT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.riwayat_rekomendasis
    ADD CONSTRAINT fk_riwayat_rekomendasis_session FOREIGN KEY (session_id) REFERENCES public.sessions(session_id);


--
-- TOC entry 4904 (class 2606 OID 16701)
-- Name: riwayat_simulasis fk_riwayat_simulasis_session; Type: FK CONSTRAINT; Schema: public; Owner: CURRENT_USER
--

ALTER TABLE ONLY public.riwayat_simulasis
    ADD CONSTRAINT fk_riwayat_simulasis_session FOREIGN KEY (session_id) REFERENCES public.sessions(session_id);


-- Completed on 2026-08-02 21:05:49

--
-- CURRENT_USERQL database dump complete
--

-- \unrestrict gsQEw1zVzf8ZmdVIo1PTE3LWMK3hTSc1hDBFt2tqYaMK1fWoW0conDyQMPm5GeX

