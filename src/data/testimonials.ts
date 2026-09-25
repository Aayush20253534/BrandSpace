import type { ContentStatus } from "./site";

/**
 * Client feedback.
 *
 * ⚠️ All entries are TEMPORARY DESIGN PLACEHOLDERS (status: "placeholder").
 * Replace quote, name, role and photo with real, approved client feedback,
 * then set status to "verified". Photos go in /public/testimonials/.
 */

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Portfolio slug this feedback belongs to. */
  project?: string;
  /** Square image, displayed as a circle. `null` renders an initials monogram. */
  photo: { src: string; alt: string } | null;
  status: ContentStatus;
};

export const testimonials: Testimonial[] = [
  {
    id: "casa-de-grande",
    quote:
      "BrandSpace understood that we weren’t selling rooms, we were selling the feeling of arriving. The new website finally looks like the hotel our guests actually experience.",
    name: "Aditya Srivastava",
    role: "Director",
    company: "Casa De Grande",
    project: "casa-de-grande",
    photo: null,
    status: "placeholder",
  },
  {
    id: "bar-code",
    quote:
      "They captured the mood of the venue perfectly. Reservations come through the site and WhatsApp every week, and the brand finally feels as premium online as it does on a Saturday night.",
    name: "Rahul Kesarwani",
    role: "Founder",
    company: "Bar Code",
    project: "bar-code",
    photo: null,
    status: "placeholder",
  },
  {
    id: "zobhunger",
    quote:
      "The team translated a complex workforce offering into a site that decision-makers get in seconds. Our enquiries are more qualified and our sales conversations start further ahead.",
    name: "Neha Verma",
    role: "Head of Growth",
    company: "ZOBHUNGER",
    project: "zobhunger",
    photo: null,
    status: "placeholder",
  },
  {
    id: "rovauto",
    quote:
      "From the booking flow to local search, BrandSpace built everything around how vehicle owners in Prayagraj actually look for a garage. The platform feels trustworthy from the first click.",
    name: "Saurabh Mishra",
    role: "Co-founder",
    company: "Rovauto",
    project: "rovauto",
    photo: null,
    status: "placeholder",
  },
  {
    id: "lotus-family-dental",
    quote:
      "Patients tell us the website made them comfortable booking before they ever visited. Our Google profile and site now work together instead of competing for attention.",
    name: "Dr. Priya Agarwal",
    role: "Lead Dentist",
    company: "Lotus Family Dental",
    project: "lotus-family-dental",
    photo: null,
    status: "placeholder",
  },
  {
    id: "eclectic-dental-care",
    quote:
      "Clear, calm and professional — exactly how we want patients to feel. BrandSpace made our clinic easy to find and easy to choose.",
    name: "Dr. Ankit Tiwari",
    role: "Clinic Director",
    company: "Eclectic Dental Care",
    project: "eclectic-dental-care",
    photo: null,
    status: "placeholder",
  },
];

export const verifiedTestimonials = testimonials.filter((testimonial) => testimonial.status === "verified");

export function getTestimonial(id: string | undefined) {
  return verifiedTestimonials.find((testimonial) => testimonial.id === id);
}
