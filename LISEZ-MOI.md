# Mon Budget — V1.0.0

Application personnelle pour iPhone. Aucun compte, aucune connexion bancaire, aucun serveur de données. HTML/CSS/JavaScript sans bibliothèque distante. Les données sont stockées dans IndexedDB sur l’appareil. Un seul compte courant suivi.

## Déployer sur GitHub Pages

1. Décompresse MonBugetV1.zip.
2. Dans ton dépôt GitHub, téléverse **le contenu** du dossier MonBugetV1 : index.html, style.css, app.mjs, core.mjs, sw.js, manifest.webmanifest et le dossier icons. index.html doit être à la racine de la publication. Ne téléverse pas seulement le ZIP.
3. Dans Settings → Pages, choisis Deploy from a branch, puis main et / (root). Enregistre et attends la publication.
4. Ouvre l’adresse HTTPS affichée par GitHub Pages dans Safari sur ton iPhone. Une connexion Internet est nécessaire à ce premier chargement.
5. Dans Safari : Partager → Sur l’écran d’accueil → Ajouter. Lance ensuite l’application depuis cette icône. Configure ton budget depuis cette icône et garde ce mode d’ouverture.
6. Attends le message « Prêt hors ligne ». Ferme l’application, active le mode avion et rouvre-la depuis l’icône pour vérifier le fonctionnement hors ligne sur ton iPhone.

Les chemins sont relatifs : le site fonctionne dans un sous-dossier GitHub Pages. Aucun domaine à modifier dans le code. GitHub héberge le code ; tes opérations et sauvegardes ne lui sont pas transmises. Les accès au site et les vérifications de mise à jour peuvent contacter l’hébergeur quand Internet est disponible, sans inclure les données budgétaires. Ne place jamais de sauvegarde JSON personnelle dans le dépôt.

## Première utilisation

- Indique le solde de ton compte courant au **début** de la journée choisie. Si tu utilises le solde bancaire après les opérations du jour, choisis plutôt le lendemain ou ne ressaisis pas ces opérations (le début du suivi ne peut pas être futur).
- Exemple : solde au réveil du 1er novembre = 1 000 €. Toute opération du 1er novembre doit ensuite être enregistrée. Si tu démarres le 15, le premier mois est partiel.
- Utilise le bouton ＋ pour saisir un montant, sa catégorie, la date et le statut. Le libellé et la note sont facultatifs. Les dates futures restent « prévues ».
- Ne saisis pas deux fois une opération : confirme l’échéance déjà proposée plutôt que d’ajouter un deuxième paiement.
- Une récurrence est un modèle mensuel. Les occurrences sont générées localement lors de la consultation, sans tâche réseau. Elles restent « prévues » jusqu’à confirmation. Tu peux changer le montant ou la date réelle de cette seule occurrence.
- Modifier une récurrence crée une nouvelle version à partir du mois suivant. L’historique n’est pas réécrit. Arrêter une récurrence empêche les occurrences des prochains mois ; les opérations enregistrées et les anciennes échéances à traiter restent présentes.
- Les jours 29 à 31 sont ramenés au dernier jour d’un mois plus court. Une occurrence supprimée ne revient pas automatiquement.
- Pour une charge annuelle, ajoute une opération prévue à sa date. La V1 automatise les récurrences **mensuelles** seulement.

## Dashboard et quatre tableaux

- Le solde confirmé est le solde initial augmenté des entrées confirmées et diminué des sorties confirmées. Pour un mois passé, il s’agit du solde à fin de mois ; pour le mois courant ou futur, du solde confirmé à aujourd’hui.
- Le prévisionnel du mois ajoute toutes les opérations prévues du mois et les échéances prévues antérieures non traitées. Ces retards sont signalés : confirme ou annule-les. Les opérations non saisies ne peuvent pas être anticipées.
- Le camembert regroupe les dépenses confirmées fixes, variables et les mensualités de prêt. Les petites catégories sont regroupées dans « Autres catégories ». L’épargne est affichée séparément. Les montants exacts sont dans le journal et les tableaux.
- Les versements d’épargne diminuent le compte courant ; les retraits d’épargne l’augmentent. Les retraits ne sont pas du salaire. Un transfert d’épargne déjà saisi ne doit pas être enregistré en revenu une deuxième fois.
- Dans Bilans, les quatre tableaux affichent le budget mensuel habituel et le réalisé. Le budget est une référence permanente, indépendante du calendrier des échéances ; ce n’est pas une enveloppe par mois avec historique de versions.
- Prêts : renseigne le capital restant dû et sa date depuis le relevé. Aucune déduction automatique du capital à partir des mensualités (qui peuvent inclure intérêts et assurance).
- Épargne : renseigne la valorisation et sa date. Les versements ne mesurent pas les gains du PEA/PER. Ces valeurs ne sont pas additionnées au compte courant.
- Le bilan annuel affiche les flux confirmés, y compris les ajustements dans la variation du compte. Il ne constitue pas un calcul de performance financière.
- Ajuster le solde crée une opération de correction datée d’aujourd’hui, visible au journal. Vérifie d’abord les oublis et doublons.
- Pour une dépense remboursée, la V1 permet de saisir le remboursement comme « Autre revenu » ; elle ne le déduit pas automatiquement de la catégorie initiale.

## Sauvegarde indispensable

Réglages → Sauvegarder en JSON. Sur iPhone, conserve le fichier dans Fichiers et vérifie sa présence. Le bouton lance un export ; l’application ne peut pas vérifier l’enregistrement final par iOS. Un rappel apparaît après 7 jours sans export. Tu peux stocker le fichier dans « Sur mon iPhone » sans service en ligne.

Le JSON contient le solde initial, les opérations, les récurrences et leurs versions, les occurrences annulées, les budgets et les relevés. La restauration valide le format, affiche une confirmation puis remplace les données locales de façon atomique. Le CSV permet seulement une lecture dans Excel ; les échéances virtuelles non confirmées ne figurent pas dans le CSV.

La sauvegarde n’est pas chiffrée. Protège ton iPhone et tes fichiers. Aucun mot de passe d’application n’est prévu ; la confidentialité repose sur le verrouillage de l’appareil.

Ne supprime pas les données Safari, ne désinstalle pas l’icône et ne change pas d’adresse du site avant une sauvegarde. Le stockage navigateur peut être purgé par iOS. Les données peuvent être distinctes selon le mode d’ouverture et l’origine : garde la même icône, le même navigateur et la même adresse. Une PWA locale n’offre pas une garantie absolue de conservation.

## Mises à jour

Sauvegarde d’abord tes données. Remplace les fichiers en conservant la même adresse de publication et le nom de base IndexedDB. Pour une future version du code, modifie le nom CACHE dans sw.js. Ferme toutes les fenêtres de l’application et rouvre-la en ligne ; la nouvelle version attend la fermeture des anciennes fenêtres avant activation. Le service worker ne supprime jamais IndexedDB. Ne renomme pas arbitrairement la base ou le schéma de sauvegarde.

## Limites et vérification

Pas de synchronisation, pas de connexion bancaire, pas de notifications iOS, pas de chiffrement, pas de comptes multiples. Aucune donnée d’exemple incluse. Calculs en euros, arrondis aux centimes. La qualité du solde dépend de la complétude des saisies. Catégories prédéfinies dans core.mjs.

Effectue un premier essai complet sur l’iPhone : solde initial, dépense, récurrence, confirmation, export, restauration et réouverture en mode avion. Les tests automatisés de calcul sont fournis dans tests.mjs et se lancent sur ordinateur avec `node tests.mjs` ; ils ne remplacent pas l’essai Safari/iOS.
