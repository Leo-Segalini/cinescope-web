'use client'

export default function MentionsLegalesPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold mb-8">Mentions Légales</h1>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Éditeur du site</h2>
          <p>Le site CinéScope est édité par :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>MONSIEUR LEO SEGALINI-BRIANT</li>
            <li>Entrepreneur individuel</li>
            <li>37 B RUE DES CAMOMILLES, 97436 SAINT-LEU</li>
            <li>SIREN : 983 411 174</li>
            <li>SIRET : 98341117400029</li>
            <li>Code APE : 6311Z - Traitement de données, hébergement et activités connexes</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Directeur de la publication</h2>
          <p>Le directeur de la publication est Monsieur Léo SEGALINI-BRIANT.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Hébergement</h2>
          <p>Le site est hébergé par :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Vercel Inc.</li>
            <li>440 N Barranca Ave #4133</li>
            <li>Covina, CA 91723</li>
            <li>support@vercel.com</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Propriété intellectuelle</h2>
          <p>L&apos;ensemble du site et chacun de ses éléments sont protégés par le droit d&apos;auteur et de propriété intellectuelle. Toute reproduction, représentation, utilisation ou adaptation, sous quelque forme que ce soit, de tout ou partie des éléments du site est strictement interdite sans l&apos;autorisation écrite préalable de CinéScope.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Données et API TMDB</h2>
          <p>Ce produit utilise l&apos;API TMDB mais n&apos;est pas approuvé ou certifié par TMDB. Les données concernant les films, séries et personnes sont fournies par The Movie Database (TMDB).</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Contact</h2>
          <p>Pour toute question concernant le site, vous pouvez nous contacter à l&apos;adresse suivante :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Email : contact@cinescope.fr</li>
            <li>Adresse : 37 B RUE DES CAMOMILLES, 97436 SAINT-LEU</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Date de mise à jour</h2>
          <p>Les présentes mentions légales ont été mises à jour le 27 décembre 2024.</p>
        </section>
      </div>
    </div>
  )
} 