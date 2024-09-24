--
-- PostgreSQL database dump
--

-- Dumped from database version 13.16 (Debian 13.16-1.pgdg120+1)
-- Dumped by pg_dump version 13.16 (Debian 13.16-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: Likes; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Likes" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "postId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Likes" OWNER TO admin;

--
-- Name: Likes_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Likes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Likes_id_seq" OWNER TO admin;

--
-- Name: Likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Likes_id_seq" OWNED BY public."Likes".id;


--
-- Name: Posts; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Posts" (
    id integer NOT NULL,
    content text NOT NULL,
    "imageUrl" character varying(255),
    "cloudinaryId" character varying(255),
    "likeCount" integer DEFAULT 0,
    "userId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Posts" OWNER TO admin;

--
-- Name: Posts_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Posts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Posts_id_seq" OWNER TO admin;

--
-- Name: Posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Posts_id_seq" OWNED BY public."Posts".id;


--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO admin;

--
-- Name: UserProfiles; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."UserProfiles" (
    id integer NOT NULL,
    "profilePicture" character varying(255),
    "userId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "cloudinaryId" character varying(255)
);


ALTER TABLE public."UserProfiles" OWNER TO admin;

--
-- Name: UserProfiles_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."UserProfiles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."UserProfiles_id_seq" OWNER TO admin;

--
-- Name: UserProfiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."UserProfiles_id_seq" OWNED BY public."UserProfiles".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255),
    password character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "isEmailConfirmed" boolean DEFAULT false,
    "confirmationToken" character varying(255),
    "resetPasswordToken" character varying(255),
    "resetPasswordExpires" timestamp with time zone
);


ALTER TABLE public."Users" OWNER TO admin;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Users_id_seq" OWNER TO admin;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: Likes id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Likes" ALTER COLUMN id SET DEFAULT nextval('public."Likes_id_seq"'::regclass);


--
-- Name: Posts id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Posts" ALTER COLUMN id SET DEFAULT nextval('public."Posts_id_seq"'::regclass);


--
-- Name: UserProfiles id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."UserProfiles" ALTER COLUMN id SET DEFAULT nextval('public."UserProfiles_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Data for Name: Likes; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Likes" (id, "userId", "postId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Posts; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Posts" (id, content, "imageUrl", "cloudinaryId", "likeCount", "userId", "createdAt", "updatedAt") FROM stdin;
1	Ini adalah postingan pertama saya!	https://example.com/image.jpg	1d4cdbf3790df7018ee79edbe9a5c5a9	0	38	2024-09-21 06:33:53.395+00	2024-09-21 06:33:53.395+00
\.


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."SequelizeMeta" (name) FROM stdin;
20240902015711-create-user.js
20240904234908-add-new-fields-to-users.js
20240904235625-add-constraints-and-change-column-types.js
20240909232733-modify-user-and-create-userProfile.js
20240909234053-remove-profilePicture-from-users.js
20240915012525-add-cloudinary-id-to-user-profiles.js
20240920150948-create-post.js
20240920151018-create-like.js
\.


--
-- Data for Name: UserProfiles; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."UserProfiles" (id, "profilePicture", "userId", "createdAt", "updatedAt", "cloudinaryId") FROM stdin;
3	https://res.cloudinary.com/dpikh72ub/image/upload/v1726421448/kn8jvl4fqdyldmcqncuv.jpg	36	2024-09-15 17:30:48.81+00	2024-09-15 17:30:48.81+00	kn8jvl4fqdyldmcqncuv
6	https://res.cloudinary.com/dpikh72ub/image/upload/v1726470002/user_profiles/dofnqqu258thanrww7nx.jpg	37	2024-09-16 07:00:01.642+00	2024-09-16 07:00:01.642+00	user_profiles/dofnqqu258thanrww7nx
7	https://res.cloudinary.com/dpikh72ub/image/upload/v1726470473/user_profiles/hxtlr8mxcjnskmuboxbj.jpg	37	2024-09-16 07:07:52.597+00	2024-09-16 07:07:52.597+00	user_profiles/hxtlr8mxcjnskmuboxbj
8	https://res.cloudinary.com/dpikh72ub/image/upload/v1726471605/user_profiles/nhqkyhsrqmrozwv0ywep.jpg	37	2024-09-16 07:26:44.133+00	2024-09-16 07:26:44.133+00	user_profiles/nhqkyhsrqmrozwv0ywep
9	https://res.cloudinary.com/dpikh72ub/image/upload/v1726471989/user_profiles/zpma1blpi4a2zlrcsvpi.jpg	37	2024-09-16 07:33:08.706+00	2024-09-16 07:33:08.706+00	user_profiles/zpma1blpi4a2zlrcsvpi
10	https://res.cloudinary.com/dpikh72ub/image/upload/v1726474279/user_profiles/dt80ehr6ywizu7usghok.jpg	38	2024-09-16 08:11:18.248+00	2024-09-16 08:11:18.248+00	user_profiles/dt80ehr6ywizu7usghok
11	https://res.cloudinary.com/dpikh72ub/image/upload/v1726475150/user_profiles/bbwqgmjtjewki4gmlhbi.png	38	2024-09-16 08:25:49.52+00	2024-09-16 08:25:49.52+00	user_profiles/bbwqgmjtjewki4gmlhbi
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Users" (id, username, email, password, "createdAt", "updatedAt", "isEmailConfirmed", "confirmationToken", "resetPasswordToken", "resetPasswordExpires") FROM stdin;
36	faOri	farhan@yopmail.com	$2b$10$GqJDai/yY.zTyGYNA3zkC.tknejMXQY/3SZ90ftzHBsS/ZUvjgjpe	2024-09-10 13:34:02.398+00	2024-09-10 13:34:02.398+00	f	cef9bfaaf6f6479d8813ad4ae07e3e93c9b96e4e	\N	\N
37	faCopy1	farhan1@yopmail.com	$2b$10$sd9i1oo1jchSIGBkZaQ32OehdcYDn0oZFXVyUL1pbXA4inyAQ.WKa	2024-09-10 13:39:59.91+00	2024-09-10 13:39:59.91+00	f	edf28788b20f1c8130b5cb6cdd2d42e3fee4c709	\N	\N
38	faCopy2	farhan2@yopmail.com	$2b$10$6560cTbxYfJVMIo3DMM.W.lzx4NLyW1C5DGrhGY11vmogXoQLbPCy	2024-09-10 23:31:22.799+00	2024-09-10 23:32:13.396+00	t	\N	\N	\N
\.


--
-- Name: Likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Likes_id_seq"', 1, false);


--
-- Name: Posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Posts_id_seq"', 1, true);


--
-- Name: UserProfiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."UserProfiles_id_seq"', 11, true);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Users_id_seq"', 57, true);


--
-- Name: Likes Likes_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Likes"
    ADD CONSTRAINT "Likes_pkey" PRIMARY KEY (id);


--
-- Name: Posts Posts_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Posts"
    ADD CONSTRAINT "Posts_pkey" PRIMARY KEY (id);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: UserProfiles UserProfiles_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."UserProfiles"
    ADD CONSTRAINT "UserProfiles_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_username_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key" UNIQUE (username);


--
-- Name: Users unique_email_constraint; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT unique_email_constraint UNIQUE (email);


--
-- Name: likes_user_id_post_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX likes_user_id_post_id ON public."Likes" USING btree ("userId", "postId");


--
-- Name: Likes Likes_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Likes"
    ADD CONSTRAINT "Likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Posts"(id);


--
-- Name: Likes Likes_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Likes"
    ADD CONSTRAINT "Likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id);


--
-- Name: Posts Posts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Posts"
    ADD CONSTRAINT "Posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id);


--
-- Name: UserProfiles UserProfiles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."UserProfiles"
    ADD CONSTRAINT "UserProfiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

