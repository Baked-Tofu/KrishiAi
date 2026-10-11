import { useEffect, useState } from 'react';
import { getSavedLang } from './languages';

export const STRINGS = {
  'en-IN': {
    mic_tap: 'Tap and speak', listening: 'Listening…', thinking: 'Thinking…',
    documents: 'Document', label: 'Pesticide', complaint: 'Complaint',
    prices: 'Prices', person: 'Talk to a person', listen: 'Listen', stop: 'Stop',
    type_here: 'Type your question…',
  },
  'hi-IN': {
    mic_tap: 'बोलने के लिए दबाएँ', listening: 'सुन रहा हूँ…', thinking: 'सोच रहा हूँ…',
    documents: 'दस्तावेज़', label: 'कीटनाशक', complaint: 'शिकायत',
    prices: 'भाव', person: 'किसी व्यक्ति से बात करें', listen: 'सुनें', stop: 'रोकें',
    type_here: 'अपना सवाल लिखें…',
  },
  'te-IN': {
    mic_tap: 'మాట్లాడటానికి నొక్కండి', listening: 'వింటున్నాను…', thinking: 'ఆలోచిస్తున్నాను…',
    documents: 'పత్రం', label: 'పురుగుమందు', complaint: 'ఫిర్యాదు',
    prices: 'ధరలు', person: 'ఒక వ్యక్తితో మాట్లాడండి', listen: 'వినండి', stop: 'ఆపండి',
    type_here: 'మీ ప్రశ్న టైప్ చేయండి…',
  },
};

export function useT() {
  const [lang, setLang] = useState('en-IN');
  useEffect(() => {
    setLang(getSavedLang());
    const onChange = () => setLang(getSavedLang());
    window.addEventListener('langchange', onChange);
    return () => window.removeEventListener('langchange', onChange);
  }, []);
  const t = (key) => (STRINGS[lang] || STRINGS['en-IN'])[key] || STRINGS['en-IN'][key];
  return { lang, t };
}