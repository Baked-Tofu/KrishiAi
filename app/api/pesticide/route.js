import { NextResponse } from 'next/server';

// TODO: replace with real OCR + CIB&RC registered-product lookup.
// Stubbed for now so the frontend flow can be built and demoed end-to-end.
const MOCK_REGISTRY = [
  { name: 'Chlorpyrifos 20% EC', toxicityClass: 'Yellow', phi: '15 days', registered: true },
  { name: 'Monocrotophos 36% SL', toxicityClass: 'Red', phi: '21 days', registered: true },
];

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('label');

    if (!file) {
      return NextResponse.json({ error: 'No label image provided' }, { status: 400 });
    }

    // TODO: run OCR on the image, extract product name + registration number,
    // then look it up against the real CIB&RC dataset instead of MOCK_REGISTRY.
    const match = MOCK_REGISTRY[Math.floor(Math.random() * MOCK_REGISTRY.length)];

    const usageInstructionsByClass = {
      Red: 'Extremely/highly toxic. Wear gloves, mask, and full protective clothing. Do not use near water sources. Keep children and animals away.',
      Yellow: 'Moderately toxic. Wear gloves and mask. Wash hands thoroughly after use.',
      Blue: 'Slightly toxic. Wash hands after use. Avoid contact with eyes.',
      Green: 'Low toxicity. Standard precautions apply — wash hands after use.',
    };

    return NextResponse.json({
      productName: match.name,
      toxicityClass: match.toxicityClass,
      registered: match.registered,
      phi: match.phi,
      usageInstructions: usageInstructionsByClass[match.toxicityClass],
    });
  } catch (err) {
    console.error('Pesticide analysis error:', err);
    return NextResponse.json({ error: 'Something went wrong reading the label' }, { status: 500 });
  }
}
