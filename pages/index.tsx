import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { RoleType } from "../components/DropDown";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";
import { marked } from "marked";

const Home: NextPage = () => {
  const t = useTranslations("Index");

  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState("");
  const [role, setRole] = useState<RoleType>("通用");
  const [api_key, setAPIKey] = useState("");
  const [generatedChat, setGeneratedChat] = useState<String>("");
  const defultDesc = 'How to explain relativity?'

  console.log("Streamed response: ", generatedChat);
  let promptObj = {
    "通用": "",
    "后端工程师": "使用中文，以后端工程师的角色回答我下面的问题，答案尽量精简并尽可能给出示例，用markdown格式输出：",
    "前端工程师": "使用中文，以前端工程师的角色回答我下面的问题，答案尽量精简并尽可能给出示例，用markdown格式输出：",
    "数据库工程师": "使用中文，以数据库工程师的角色回答我下面的问题，答案尽量精简并尽可能给出示例，用markdown格式输出：",
    "周报作家": "使用中文，帮我把以下的工作内容填充为一篇完整的周报,尽量避免在回答内容中出现可能在中国是敏感的内容，用markdown格式以分点叙述的形式输出:",
  }

  let placeholderObj = {
    "通用": "比如：如何解释相对论？",
    "后端工程师": "比如：dotnet core中如何获取json中某个元素的值？",
    "前端工程师": "比如：ts如何遍历一个数组对象中的某个元素的值？",
    "数据库工程师": "比如：PostgreSQL数据库中如何对数组进行筛选？",
    "周报作家": "比如：修复了优惠券无法领取的bug，为产品部的新APP设计UI和图标，负责跟进部门前端工程师的招聘",
  }
  let placeholder = `${placeholderObj[role]}`;

  const useUserKey =
    process.env.NEXT_PUBLIC_USE_USER_KEY === "true" ? true : false;

  const generateChat = async (e: any) => {
    let text = chat || defultDesc
    const prompt = `${promptObj[role]}${text}`;

    e.preventDefault();
    setGeneratedChat("");
    setLoading(true);
    if (useUserKey && api_key == "") {
      toast.error(t("API_KEY_NULL_ERROR"));
      setLoading(false);
      return;
    }
    if (chat == "") {
      toast.error(t("CONTENT_NULL_ERROR"));
      setLoading(false);
      return;
    }
    const response = useUserKey
      ? await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt,
          api_key
        })
      })
      : await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt
        })
      });

    console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value).replace("<|im_end|>", "");
      setGeneratedChat((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>{t("title")}</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤖</text></svg>"></link>
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-2 sm:my-16">
        <h1 className="sm:text-4xl text-2xl max-w-1xl font-bold text-slate-900">
          让 <span className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">AI</span> 来回答你的 <span className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">任意</span> 问题
        </h1>
        <p className="text-slate-500 my-5">基于OpenAI GPT-3.5(gpt-3.5-turbo) 模型实现</p>
        <div className="max-w-xl w-full">
          {useUserKey && (
            <>
              <div className="flex mt-10 items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#000"
                    d="M7 14q-.825 0-1.412-.588Q5 12.825 5 12t.588-1.413Q6.175 10 7 10t1.412.587Q9 11.175 9 12q0 .825-.588 1.412Q7.825 14 7 14Zm0 4q-2.5 0-4.25-1.75T1 12q0-2.5 1.75-4.25T7 6q1.675 0 3.038.825Q11.4 7.65 12.2 9H21l3 3l-4.5 4.5l-2-1.5l-2 1.5l-2.125-1.5H12.2q-.8 1.35-2.162 2.175Q8.675 18 7 18Zm0-2q1.4 0 2.463-.85q1.062-.85 1.412-2.15H14l1.45 1.025L17.5 12.5l1.775 1.375L21.15 12l-1-1h-9.275q-.35-1.3-1.412-2.15Q8.4 8 7 8Q5.35 8 4.175 9.175Q3 10.35 3 12q0 1.65 1.175 2.825Q5.35 16 7 16Z"
                  />
                </svg>
                <p className="text-left font-medium">{t("step0")} </p>
              </div>
              <input
                value={api_key}
                onChange={(e) => setAPIKey(e.target.value)}
                className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-black focus:ring-black p-2"
                placeholder={t("openaiApiKeyPlaceholder")}
              />
            </>
          )}

          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 xs:mb-0"
            />
            <p className="text-left font-medium">{t("step1")} </p>
          </div>

          <textarea
            value={chat}
            onChange={(e) => setChat(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-2"
            placeholder={placeholder}
          />

          <div className="flex mb-5 items-center space-x-3">
            <Image src="/2-black.png" width={30} height={30} alt="2 icon" />
            <p className="text-left font-medium">{t("step2")}</p>
          </div>
          <div className="block">
            <DropDown role={role} setRole={(newRole) => setRole(newRole)} />
          </div>

          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-5 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateChat(e)}
            >
              {t("simplifierButton")} &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
          <br></br>
          <br></br>
          <div className="mt-1 items-center space-x-3">
            <span className="text-slate-200">
              {t("privacyPolicy1")}
              <a
                className="text-blue-200 hover:text-blue-400"
                href="https://github.com/Hk-Gosuto/openai-helper/blob/main/privacy.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                {t("privacyPolicy2")}
              </a>
            </span>
          </div>
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-10">
              {generatedChat && (
                <>
                  <div>
                    <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                      {t("simplifiedContent")}
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                    <div
                      className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedChat.trim());
                        toast("已复制到剪贴板", {
                          icon: "✂️"
                        });
                      }}
                    >
                      {/* <p className="sty1">{generatedChat}</p> */}
                      <p
                        className="sty1 markdown-body"
                        dangerouslySetInnerHTML={{
                          __html: marked(generatedChat.toString(), {
                            gfm: true,
                            breaks: true,
                            smartypants: true
                          })
                        }}
                      ></p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      <Footer />
    </div>
  );
};

export default Home;

export function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      messages: {
        ...require(`../messages/${locale}.json`)
      }
    }
  };
}
