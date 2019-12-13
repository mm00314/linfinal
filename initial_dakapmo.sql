CREATE DATABASE  IF NOT EXISTS `dakapmo` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `dakapmo`;

SET NAMES utf8 ;

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `is_admin` tinyint(4) NOT NULL DEFAULT '0',
  `registered` datetime NOT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `study`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `study` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `desc` text NOT NULL,
  `price` varchar(30) NOT NULL,
  `upload` varchar(255) DEFAULT NULL,
  `maxpeople` int(11) NOT NULL,
  `people` int(11) NOT NULL,
  `startdate` datetime NOT NULL,
  `registered` datetime NOT NULL,
  PRIMARY KEY(`id`),
  KEY `category_idx` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- LOCK TABLES `study` WRITE;
-- INSERT INTO `study`(`category`, `title`, `desc`, `price`, `upload`, `maxpeople) VALUES (1,'토익'),(2,'토플'),(3,'HSK'),(4,'JLPT'),(5,'한국사'),(6,'기타');
-- UNLOCK TABLES;

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `category` WRITE;
INSERT INTO `category` VALUES (1,'토익'),(2,'토플'),(3,'HSK'),(4,'JLPT'),(5,'한국사'),(6,'기타');
UNLOCK TABLES;

LOCK TABLES `user` WRITE;
INSERT INTO `user` VALUES (1,'Jane','jane@abc.com','81dc9bdb52d04dc20036dbd8313ed055',1,'2018-11-02 17:53:54',NULL),(2,'Mike','mike@def.com','81dc9bdb52d04dc20036dbd8313ed055',0,'2018-11-03 17:54:45',NULL),(3,'Tom','tom@goo.com','81dc9bdb52d04dc20036dbd8313ed055',0,'2018-11-04 17:55:04',NULL),(4,'Rob','rob@yaho.com','81dc9bdb52d04dc20036dbd8313ed055',0,'2018-11-04 17:55:39',NULL),(9,'Kiehls','kiehls@ny.com','81dc9bdb52d04dc20036dbd8313ed055',0,'2018-12-05 01:11:48',NULL);
UNLOCK TABLES;

CREATE TABLE `checkstudy` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `study_id` INT NOT NULL,
  `desc` TEXT NOT NULL,
  `picture` TEXT NOT NULL,
  `author` VARCHAR(45) NOT NULL,
  `registered` DATETIME NOT NULL,
PRIMARY KEY (`id`));

CREATE TABLE `participate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `study_id` INT NOT NULL,
  `registered` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;