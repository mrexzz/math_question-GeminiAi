import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Question() {
    const [loading, setLoading] = useState(false);
    const [apiData, setApiData] = useState([]);
    const [Testdata, setTestData] = useState([]);
    const [load, setLoad] = useState(false);
    const soru = "bana 1 adet toplama işlemi sor ";
    const genAI = new GoogleGenerativeAI(APİ_KEY);

    // Farklı prompt1 çıktıları için dizi oluştur
    const prompts = [
        "Bana sorunun kaçıncı soru olduğunu söylemeden ilkokul seviyesinde 1 adet 4 işlem sorusu ",
        // Diğer prompt1 çıktılarını ekleyin
    ];

    const fetchData = async () => {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Rastgele bir prompt1 seç
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

        const prompt1 = `
            ${randomPrompt}
        `;

        const result = await model.generateContent(prompt1);
        const response = await result.response;
        const text = response.text();
        return text;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const fetchDataArray = Array.from({ length: 10 }, async () => await fetchData());
        const results = await Promise.all(fetchDataArray);
        setApiData(results);
        setLoading(false);
        setTestData([]);
        setLoad(false);
    };

    const Data = async () => {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const answersArray = apiData.map((promptResult) => {
            const prompt = `${promptResult} sorulan sorunun cevabını yaz`;
            return model.generateContent(prompt);
        });

        const results = await Promise.all(answersArray);
        const answers = results.map((result) => result.response.text());
        setTestData(answers);
        setLoad(false);
    };

    const answer = async (a) => {
        a.preventDefault();
        setLoad(true);
        await Data();
    };

    return (
        <>
            <div className="container">
                <h1>Project X</h1>
                <h3>Soru Yapıcı</h3>
                <div className="mt-5 mb-5" id="buton1">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <button type="submit" className="btn btn-primary mt-3 col-lg-12">
                                Soru Üret
                            </button>
                        </div>
                    </form>
                </div>
                <div className="try">
                    {!loading && apiData.map((data, index) => <p key={index} className="text-align-left">{data}</p>)}
                    {loading && <p>Loading...</p>}
                </div>
            </div>

            <div className="mt-5 mb-5">
                <form onSubmit={answer}>
                    <div>
                        <button type="submit" className="btn btn-primary mt-3 col-lg-12">
                            Soruyu Cevapla
                        </button>
                    </div>
                </form>
            </div>
            <div>
                {!load && Testdata.map((data, index) => <p key={index} className="text-align-left">{data}</p>)}
                {load && <p>Loading...</p>}
            </div>
        </>
    );
}

