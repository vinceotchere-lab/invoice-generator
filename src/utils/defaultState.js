let idCounter = 0;
export function nextId() {
  idCounter += 1;
  return `item-${Date.now()}-${idCounter}`;
}

export function defaultState() {
  return {
    business: {
      name: "NAJERA",
      tagline: "Professional Videography Services",
      owner: "Alexis Najera",
      address: "4701 Rosewood Avenue, Bakersfield, CA 93306, Kern County",
      email: "Alexisnajera09@outlook.com",
      phone: "+1 (661) 431-4208",
    },
    invoice: {
      number: "INV-0001",
      date: new Date().toISOString().slice(0, 10),
      dueDate: "",
      projectRef: "",
    },
    client: {
      name: "",
      address: "",
      email: "",
      phone: "",
    },
    items: [
      { id: nextId(), description: "Videography services — event filming, half/full day", qty: "1", rate: "" },
      { id: nextId(), description: "Video editing & post-production", qty: "1", rate: "" },
      { id: nextId(), description: "Motion graphics / titles / captions", qty: "1", rate: "" },
      { id: nextId(), description: "Additional revisions (beyond included rounds)", qty: "", rate: "" },
      { id: nextId(), description: "Travel / equipment / other costs", qty: "", rate: "" },
    ],
    depositPaid: "",
    taxRate: "",
    payment: {
      method: "Bank Transfer",
      payableTo: "Alexis Najera / NAJERA",
      bankDetails: "",
      lateFeePercent: "",
    },
  };
}
