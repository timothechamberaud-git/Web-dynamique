USE mercato_nova;

CREATE TABLE IF NOT EXISTS SIGNALEMENT (
    NumSig INT AUTO_INCREMENT PRIMARY KEY,
    TypeAlerte VARCHAR(100) NOT NULL,
    NumU_Cible INT NOT NULL,
    DateSignalement DATETIME DEFAULT CURRENT_TIMESTAMP,
    Statut VARCHAR(50) DEFAULT 'EN ATTENTE',
    FOREIGN KEY (NumU_Cible) REFERENCES UTILISATEUR(NumU) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS NOTIFICATION (
    NumNotif INT AUTO_INCREMENT PRIMARY KEY,
    NumU_Cible INT NOT NULL,
    TypeNotif VARCHAR(50) NOT NULL,
    Contenu TEXT NOT NULL,
    Lien VARCHAR(255),
    Lu BOOLEAN DEFAULT FALSE,
    DateNotif DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (NumU_Cible) REFERENCES UTILISATEUR(NumU) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Insérer le compte Admin
INSERT IGNORE INTO UTILISATEUR (Nom, Prenom, Email, Role, MotDePasse) 
VALUES ('Nova', 'Admin', 'admin@nova.com', 'admin', '$2y$10$wE0n5.L04L.R9h/2pUqPLeV/e4z3KzE7fW24gR2mB1jL.yYn33K/e');

-- Insérer quelques faux signalements pour la maquette
INSERT INTO SIGNALEMENT (TypeAlerte, NumU_Cible, Statut, DateSignalement) VALUES 
('Suspicion Contrefaçon', 1, 'SUSPENDRE', '2026-05-26 14:10:00'),
('Litige Négociation', 2, 'MÉRITE EXAMEN', '2026-05-26 09:45:00'),
('Enchère Fantôme', 1, 'IGNORER', '2026-05-25 22:15:00');

-- Insérer quelques notifications de test pour l'utilisateur 2 (acheteur)
INSERT INTO NOTIFICATION (NumU_Cible, TypeNotif, Contenu, Lien, Lu) VALUES 
(2, 'ENCHERE', 'Quelqu\'un a fait une nouvelle offre sur la Jordan 1 !', '/produit/4', FALSE),
(2, 'NEGO', 'Nouveau message dans votre négociation pour le Vélo Trek.', '/nego/2', FALSE);
