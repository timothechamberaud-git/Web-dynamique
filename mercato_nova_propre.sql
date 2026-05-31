
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `categorie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorie` (
  `NumCat` int NOT NULL AUTO_INCREMENT,
  `NomCat` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`NumCat`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO `categorie` VALUES (1,'Football'),(2,'Cyclisme'),(3,'Tennis'),(4,'Golf'),(5,'Basketball');
DROP TABLE IF EXISTS `commande`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commande` (
  `NumCmd` int NOT NULL AUTO_INCREMENT,
  `DateCmd` datetime DEFAULT CURRENT_TIMESTAMP,
  `MontantTotal` decimal(10,2) NOT NULL,
  `NumU_Acheteur` int NOT NULL,
  PRIMARY KEY (`NumCmd`),
  KEY `NumU_Acheteur` (`NumU_Acheteur`),
  CONSTRAINT `commande_ibfk_1` FOREIGN KEY (`NumU_Acheteur`) REFERENCES `utilisateur` (`NumU`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO `commande` VALUES (1,'2026-05-29 17:03:13',600.00,5),(2,'2026-05-29 17:04:29',600.00,5),(8,'2026-05-29 18:51:21',190.00,4),(9,'2026-05-30 12:27:10',600.00,3),(10,'2026-05-30 12:30:47',550.00,4),(11,'2026-05-31 17:06:28',523.00,5);
DROP TABLE IF EXISTS `contient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contient` (
  `NumCmd` int NOT NULL,
  `NumProd` int NOT NULL,
  `Quantite` int NOT NULL DEFAULT '1',
  `PrixUnit` decimal(10,2) NOT NULL,
  PRIMARY KEY (`NumCmd`,`NumProd`),
  KEY `NumProd` (`NumProd`),
  CONSTRAINT `contient_ibfk_1` FOREIGN KEY (`NumCmd`) REFERENCES `commande` (`NumCmd`) ON DELETE CASCADE,
  CONSTRAINT `contient_ibfk_2` FOREIGN KEY (`NumProd`) REFERENCES `produit` (`NumProd`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO `contient` VALUES (1,6,1,600.00),(2,6,1,600.00),(8,1,1,190.00),(9,7,1,600.00),(11,9,1,523.00);
DROP TABLE IF EXISTS `enchere`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enchere` (
  `NumEnchere` int NOT NULL AUTO_INCREMENT,
  `DateFin` datetime NOT NULL,
  `PrixActuel` decimal(10,2) NOT NULL,
  `NumProd` int NOT NULL,
  PRIMARY KEY (`NumEnchere`),
  KEY `NumProd` (`NumProd`),
  CONSTRAINT `enchere_ibfk_1` FOREIGN KEY (`NumProd`) REFERENCES `produit` (`NumProd`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO `enchere` VALUES (1,'2026-05-30 14:04:07',190.00,1),(2,'2026-06-03 16:40:29',1100.00,5),(3,'2026-05-30 14:04:07',523.00,9);
DROP TABLE IF EXISTS `message_nego`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message_nego` (
  `NumMsg` int NOT NULL AUTO_INCREMENT,
  `Contenu` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `DateMsg` datetime DEFAULT CURRENT_TIMESTAMP,
  `MontantProp` decimal(10,2) DEFAULT NULL,
  `NumNego` int NOT NULL,
  `NumU_Expediteur` int NOT NULL,
  PRIMARY KEY (`NumMsg`),
  KEY `NumNego` (`NumNego`),
  KEY `NumU_Expediteur` (`NumU_Expediteur`),
  CONSTRAINT `message_nego_ibfk_1` FOREIGN KEY (`NumNego`) REFERENCES `negociation` (`NumNego`) ON DELETE CASCADE,
  CONSTRAINT `message_nego_ibfk_2` FOREIGN KEY (`NumU_Expediteur`) REFERENCES `utilisateur` (`NumU`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO `message_nego` VALUES (1,'Bonjour, je propose 1 300 € pour ce vélo.','2026-05-29 16:40:29',NULL,1,2),(2,'Bonjour. C\'est un peu bas au vu des options. Je propose 1 500 €','2026-05-29 16:40:29',NULL,1,1),(3,'C\'est ma dernière proposition.','2026-05-29 16:40:29',1450.00,1,2),(4,'Nouvelle offre de 1000 €','2026-05-29 16:41:53',1000.00,3,4),(5,'bonjour j\'aimerais acheter le maillot ','2026-05-29 16:51:01',600.00,10,5),(6,'bonjour j\'aimerais negocie','2026-05-29 16:56:15',600.00,11,3),(8,'Offre de 600.00 € acceptée ! Le produit a été vendu.','2026-05-29 17:04:29',NULL,10,4),(9,'Offre de 600.00 € acceptée ! En attente du paiement de l\'acheteur.','2026-05-29 17:22:45',600.00,11,5),(10,'Le paiement de 600.00 € a été validé ! Vente conclue définitivement.','2026-05-30 12:27:10',NULL,11,3);
DROP TABLE IF EXISTS `negociation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `negociation` (
  `NumNego` int NOT NULL AUTO_INCREMENT,
  `Statut` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'en_cours',
  `NumU_Acheteur` int NOT NULL,
  `NumProd` int NOT NULL,
  PRIMARY KEY (`NumNego`),
  KEY `NumU_Acheteur` (`NumU_Acheteur`),
  KEY `NumProd` (`NumProd`),
  CONSTRAINT `negociation_ibfk_1` FOREIGN KEY (`NumU_Acheteur`) REFERENCES `utilisateur` (`NumU`) ON DELETE CASCADE,
  CONSTRAINT `negociation_ibfk_2` FOREIGN KEY (`NumProd`) REFERENCES `produit` (`NumProd`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO `negociation` VALUES (1,'en_cours',2,2),(3,'En cours',4,2),(10,'acceptee',5,6),(11,'payee',3,7);
DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `NumNotif` int NOT NULL AUTO_INCREMENT,
  `NumU_Cible` int NOT NULL,
  `TypeNotif` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Contenu` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `Lien` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Lu` tinyint(1) DEFAULT '0',
  `DateNotif` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`NumNotif`),
  KEY `NumU_Cible` (`NumU_Cible`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`NumU_Cible`) REFERENCES `utilisateur` (`NumU`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO `notification` VALUES (1,5,'Négociation','Nouveau message ou offre dans votre salle de négociation','/nego/11',1,'2026-05-29 16:56:15'),(2,5,'Négociation','Une offre a été acceptée dans votre salle !','/nego/10',1,'2026-05-29 17:03:13'),(3,5,'Négociation','Une offre a été acceptée dans votre salle !','/nego/10',1,'2026-05-29 17:04:29'),(4,3,'Négociation','Une offre a été acceptée ! Le paiement est en attente.','/nego/11',1,'2026-05-29 17:22:45'),(7,1,'Nouvelle Enchère','Nouvelle offre de 160 € sur votre enchère.','/produit/1',0,'2026-05-29 18:46:36'),(8,1,'Nouvelle Enchère','Nouvelle offre de 155 € sur votre enchère.','/produit/1',0,'2026-05-29 18:47:03'),(9,1,'Nouvelle Enchère','Nouvelle offre de 160 € sur votre enchère.','/produit/1',0,'2026-05-29 18:50:02'),(10,1,'Nouvelle Enchère','Nouvelle offre de 170 € sur votre enchère.','/produit/1',0,'2026-05-29 18:50:38'),(11,1,'Nouvelle Enchère','Nouvelle offre de 190 € sur votre enchère.','/produit/1',0,'2026-05-29 18:50:50'),(12,1,'Enchère Payée','L\'acheteur a payé 190.00 € pour l\'enchère.','/produit/1',0,'2026-05-29 18:51:21'),(13,1,'Nouvelle Enchère','Nouvelle offre de 1000 € sur votre enchère.','/produit/5',0,'2026-05-29 18:53:59'),(14,1,'Nouvelle Enchère','Nouvelle offre de 1100 € sur votre enchère.','/produit/5',0,'2026-05-30 12:26:15'),(15,5,'Vente Conclue','Votre produit a été payé suite à une négociation !','/nego/11',1,'2026-05-30 12:27:10'),(16,3,'Négociation','Nouveau message ou offre dans votre salle de négociation','/nego/12',1,'2026-05-30 12:29:24'),(17,4,'Négociation','Nouveau message ou offre dans votre salle de négociation','/nego/12',1,'2026-05-30 12:29:47'),(18,3,'Négociation','Une offre a été acceptée ! Le paiement est en attente.','/nego/12',1,'2026-05-30 12:30:25'),(19,3,'Vente Conclue','Votre produit a été payé suite à une négociation !','/nego/12',1,'2026-05-30 12:30:47'),(20,4,'Nouvelle Enchère','Nouvelle offre de 500 € sur votre enchère.','/produit/9',1,'2026-05-30 14:00:03'),(21,4,'Nouvelle Enchère','Nouvelle offre de 523 € sur votre enchère.','/produit/9',0,'2026-05-30 14:00:48'),(22,4,'Enchère Payée','L\'acheteur a payé 523.00 € pour l\'enchère.','/produit/9',0,'2026-05-31 17:06:28');
DROP TABLE IF EXISTS `offre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offre` (
  `NumOffre` int NOT NULL AUTO_INCREMENT,
  `Montant` decimal(10,2) NOT NULL,
  `DateOffre` datetime DEFAULT CURRENT_TIMESTAMP,
  `NumU_Acheteur` int NOT NULL,
  `NumEnchere` int NOT NULL,
  PRIMARY KEY (`NumOffre`),
  KEY `NumU_Acheteur` (`NumU_Acheteur`),
  KEY `NumEnchere` (`NumEnchere`),
  CONSTRAINT `offre_ibfk_1` FOREIGN KEY (`NumU_Acheteur`) REFERENCES `utilisateur` (`NumU`) ON DELETE CASCADE,
  CONSTRAINT `offre_ibfk_2` FOREIGN KEY (`NumEnchere`) REFERENCES `enchere` (`NumEnchere`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO `offre` VALUES (1,900.00,'2026-05-29 16:49:33',4,2),(2,160.00,'2026-05-29 18:35:17',3,1),(3,160.00,'2026-05-29 18:46:36',3,1),(4,155.00,'2026-05-29 18:47:03',4,1),(5,160.00,'2026-05-29 18:50:02',4,1),(6,170.00,'2026-05-29 18:50:38',3,1),(7,190.00,'2026-05-29 18:50:50',4,1),(8,1000.00,'2026-05-29 18:53:59',3,2),(9,1100.00,'2026-05-30 12:26:15',3,2),(10,500.00,'2026-05-30 14:00:03',3,3),(11,523.00,'2026-05-30 14:00:48',5,3);
DROP TABLE IF EXISTS `produit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produit` (
  `NumProd` int NOT NULL AUTO_INCREMENT,
  `Titre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Etat` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TypeTransaction` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `PrixBase` decimal(10,2) NOT NULL,
  `NumCat` int NOT NULL,
  `NumU_Vendeur` int NOT NULL,
  `PhotoUrl` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`NumProd`),
  KEY `NumCat` (`NumCat`),
  KEY `NumU_Vendeur` (`NumU_Vendeur`),
  CONSTRAINT `produit_ibfk_1` FOREIGN KEY (`NumCat`) REFERENCES `categorie` (`NumCat`) ON DELETE RESTRICT,
  CONSTRAINT `produit_ibfk_2` FOREIGN KEY (`NumU_Vendeur`) REFERENCES `utilisateur` (`NumU`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO `produit` VALUES (1,'Maillot Vintage 98','Neuf','enchere',145.00,1,1,NULL),(2,'Vélo Trek Emonda Carbon','Très bon','nego',1200.00,2,1,NULL),(3,'Raquette Wilson Pro','Neuf','achat',89.00,3,1,NULL),(4,'Lot 12 Balles Golf','Neuf','achat',25.00,4,1,NULL),(5,'Nike Air Jordan 1 \"Vintage 85\"','Sous vide','enchere',850.00,5,1,NULL),(6,'Maillot de foot','Neuf','nego',750.00,2,4,NULL),(7,'Maillot de foot','Neuf','nego',750.00,2,5,NULL),(9,'Maillot de foot','Neuf','enchere',2.00,2,4,'https://i.etsystatic.com/59757673/r/il/89c6d2/8039580165/il_1588xN.8039580165_rfpc.jpg');
DROP TABLE IF EXISTS `signalement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `signalement` (
  `NumSig` int NOT NULL AUTO_INCREMENT,
  `TypeAlerte` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NumU_Cible` int NOT NULL,
  `DateSignalement` datetime DEFAULT CURRENT_TIMESTAMP,
  `Statut` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'EN ATTENTE',
  PRIMARY KEY (`NumSig`),
  KEY `NumU_Cible` (`NumU_Cible`),
  CONSTRAINT `signalement_ibfk_1` FOREIGN KEY (`NumU_Cible`) REFERENCES `utilisateur` (`NumU`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur` (
  `NumU` int NOT NULL AUTO_INCREMENT,
  `Nom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Prenom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Role` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'client',
  `MotDePasse` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`NumU`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO `utilisateur` VALUES (1,'Expert_75','Jean','jean@expert.com','vendeur','$2y$10$7lfx.TY/VbhKwPTCdQSWhuzrEZNmwMh6boB62ppdE4sqoN0cMmpda'),(2,'Nova','Acheteur','acheteur@nova.com','client','$2y$10$7lfx.TY/VbhKwPTCdQSWhuzrEZNmwMh6boB62ppdE4sqoN0cMmpda'),(3,'Admin','Super','admin@nova.com','admin','$2y$10$7lfx.TY/VbhKwPTCdQSWhuzrEZNmwMh6boB62ppdE4sqoN0cMmpda'),(4,'Chamberaud','Timothé','timothe.chamberaud@edu.ece.fr','client','$2y$10$7M1GzWpuxl.mTi9.SdWDMuJO96aqS5jX5grQD/xqYVck9ydt3XqRi'),(5,'Chamberaud','Timothé','timothe.chamberaud@gmail.com','client','$2y$10$ugHToACSOQLY2.6c5W.N1OC7HvSYp4gj6rvwZ0qSSUulNAkD5I7Wy');
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

