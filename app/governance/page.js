import TopicChat from '../components/TopicChat';

export default function GovernancePage() {
  return (
    <TopicChat
      title="Cooperative Governance"
      intro="Understand membership, meetings, elections and by-laws of cooperative societies."
      topic="Cooperative society governance in India (membership, general body meetings and AGM, elections, voting rights, by-laws, member duties)"
      suggestions={[
        'How do I become a member of a cooperative society?',
        'What happens at an AGM and can I vote?',
        'What are my rights as a member?',
      ]}
    />
  );
}
