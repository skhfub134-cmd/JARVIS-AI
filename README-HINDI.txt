JARVIS AI 2.0 - Hindi setup notes
=================================

इस पैकेज में:
- index.html : नीला JARVIS मोबाइल इंटरफेस
- server.js  : सुरक्षित server-side AI connection
- package.json : Node.js start command

महत्वपूर्ण:
1. अभी केवल ZIP डाउनलोड करने से असली AI चालू नहीं होगा। इसे Node.js सपोर्ट वाले सुरक्षित hosting/server पर चलाना होगा।
2. OpenAI API key को कभी index.html, GitHub repository, WhatsApp या किसी सार्वजनिक जगह पर न डालें। इसे केवल hosting की secret/environment-variable setting में रखें।
3. API इस्तेमाल में शुल्क लग सकता है। किसी अभिभावक/विश्वसनीय वयस्क की मदद से ही billing और API account सेट करें।
4. Server पर ये environment variables सेट करें:
   OPENAI_API_KEY = आपकी निजी API key (केवल server secret)
   OPENAI_MODEL = gpt-6-astra (या आपके खाते में उपलब्ध model)
5. फिर Node.js 20+ पर `npm start` चलाएँ और hosting का HTTPS URL खोलें।

यह starter आपके फोन को अपने-आप नियंत्रित नहीं करता। माइक/स्पीच ब्राउज़र की सुविधाओं और अनुमतियों पर निर्भर हैं।
