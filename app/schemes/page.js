import TopicChat from '../components/TopicChat';

export default function SchemesPage() {
  return (
    <TopicChat
      title="Government Schemes"
      intro="Ask about schemes, who is eligible and which documents you need."
      topic="Indian government schemes for farmers and rural families (eligibility, benefits, documents, how to apply)"
      suggestions={[
        'What is PM-KISAN and who is eligible?',
        'How do I enrol in PMFBY crop insurance?',
        'What documents do I need for a Kisan Credit Card?',
      ]}
    />
  );
}
