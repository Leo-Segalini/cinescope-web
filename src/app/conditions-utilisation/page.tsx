'use client'

export default function ConditionsUtilisationPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold mb-8">Conditions d&apos;Utilisation</h1>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Acceptation des conditions</h2>
          <p>En accédant à CinéScope, vous acceptez d&apos;être lié par ces conditions d&apos;utilisation, toutes les lois et réglementations applicables. Si vous n&apos;acceptez pas ces conditions, vous ne devez pas utiliser ce site.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Utilisation des données TMDB</h2>
          <div className="space-y-2">
            <p>En utilisant les données de TMDB via notre service, vous acceptez :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>D&apos;afficher clairement l&apos;attribution à TMDB pour toute utilisation de leurs données.</li>
              <li>De ne pas utiliser les données ou les images d&apos;une manière qui suggérerait que TMDB approuve ou est affilié à votre utilisation.</li>
              <li>De ne pas copier, modifier, décompiler ou créer des œuvres dérivées de TMDB sans autorisation explicite.</li>
              <li>De respecter toutes les lois applicables en matière de droits d&apos;auteur et de propriété intellectuelle.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Politique de confidentialité</h2>
          <div className="space-y-2">
            <p>Notre politique de confidentialité explique comment nous traitons vos données :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nous ne collectons que les données nécessaires au fonctionnement du service.</li>
              <li>Nous ne partageons pas vos données personnelles avec des tiers.</li>
              <li>Nous utilisons des cookies techniques essentiels au fonctionnement du site.</li>
              <li>Vous avez le droit d&apos;accéder, de modifier et de supprimer vos données.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Limitations de responsabilité</h2>
          <div className="space-y-2">
            <p>CinéScope et ses créateurs ne peuvent être tenus responsables :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Des erreurs ou omissions dans les données fournies par TMDB.</li>
              <li>Des interruptions temporaires du service pour maintenance ou mise à jour.</li>
              <li>De l&apos;utilisation faite par les utilisateurs des informations disponibles sur le site.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Droits de propriété intellectuelle</h2>
          <div className="space-y-2">
            <p>Les droits de propriété intellectuelle sont répartis comme suit :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Le contenu et les données relatifs aux films et séries appartiennent à TMDB et leurs ayants droit respectifs.</li>
              <li>L&apos;interface, le design et le code source de CinéScope sont la propriété de CinéScope.</li>
              <li>Les logos et marques commerciales appartiennent à leurs propriétaires respectifs.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Modifications des conditions</h2>
          <p>Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur publication sur le site. Il est de votre responsabilité de consulter régulièrement ces conditions.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Contact</h2>
          <p>Pour toute question concernant ces conditions d&apos;utilisation, vous pouvez nous contacter à l&apos;adresse suivante : contact@cinescope.fr</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Date de mise à jour</h2>
          <p>Les présentes conditions d&apos;utilisation ont été mises à jour le 27 décembre 2024.</p>
        </section>
      </div>
    </div>
  )
} 