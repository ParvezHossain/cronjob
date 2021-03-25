-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3308
-- Generation Time: Mar 25, 2021 at 06:52 AM
-- Server version: 8.0.18
-- PHP Version: 7.4.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `base_visu`
--

-- --------------------------------------------------------

--
-- Table structure for table `sd_halle`
--

DROP TABLE IF EXISTS `sd_halle`;
CREATE TABLE IF NOT EXISTS `sd_halle` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hallenr` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `hallebez` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `aktiv_inaktiv` tinyint(1) NOT NULL,
  `castvisu` tinyint(1) NOT NULL,
  `prodvisu` tinyint(1) NOT NULL,
  `capacity` tinyint(1) NOT NULL,
  `planvisu` tinyint(1) NOT NULL,
  `shiftvisu` tinyint(1) NOT NULL,
  `tpmvisu` tinyint(1) NOT NULL,
  `processvisu` tinyint(1) NOT NULL,
  `leanvisu` tinyint(1) NOT NULL,
  `mesvisu` tinyint(1) NOT NULL,
  `oee` double NOT NULL,
  `nutzung` double NOT NULL,
  `produkt` double NOT NULL,
  `ausschuss` double NOT NULL,
  `qualivisu` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sd_halle`
--

INSERT INTO `sd_halle` (`id`, `hallenr`, `hallebez`, `aktiv_inaktiv`, `castvisu`, `prodvisu`, `capacity`, `planvisu`, `shiftvisu`, `tpmvisu`, `processvisu`, `leanvisu`, `mesvisu`, `oee`, `nutzung`, `produkt`, `ausschuss`, `qualivisu`) VALUES
(1, '1', 'Test Halle', 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 70, 70, 80, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sd_kunde_lief`
--

DROP TABLE IF EXISTS `sd_kunde_lief`;
CREATE TABLE IF NOT EXISTS `sd_kunde_lief` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kundeliefnr` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `kundeliefbez1` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `kundeliefbez2` varchar(200) NOT NULL,
  `aktiv_inaktiv` tinyint(1) NOT NULL,
  `kunde_lief` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `adresse` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `plz` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `stadt` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `provinz` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `land` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `telefon` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `email` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `kunde_lief_gruppe` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `ansprechpartner` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `sd_maschine`
--

DROP TABLE IF EXISTS `sd_maschine`;
CREATE TABLE IF NOT EXISTS `sd_maschine` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `maschinenr` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `maschinenbez` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `hersteller` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `modell` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `baujahr` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `aktiv_inaktiv` tinyint(1) NOT NULL,
  `maschinengruppe` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `maschinengruppe_rep` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `maschinengruppe_tpm` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `halle` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `oee` tinyint(1) NOT NULL,
  `oee_100` tinyint(1) NOT NULL,
  `isnutzgrad` tinyint(1) NOT NULL,
  `ausschuss` tinyint(1) NOT NULL,
  `produktivitaet` tinyint(1) NOT NULL,
  `produktivitaet_100` tinyint(1) NOT NULL,
  `automatisiert` tinyint(1) NOT NULL,
  `bediener` float NOT NULL,
  `verteilzeit` float NOT NULL,
  `nutzgrad` float NOT NULL,
  `stundensatz` float NOT NULL,
  `stillstand_sec` float NOT NULL,
  `castvisu` tinyint(1) NOT NULL,
  `prodvisu` tinyint(1) NOT NULL,
  `capacity` tinyint(1) NOT NULL,
  `planvisu` tinyint(1) NOT NULL,
  `docvisu` tinyint(1) NOT NULL,
  `shiftvisu` tinyint(1) NOT NULL,
  `tpmvisu` tinyint(1) NOT NULL,
  `mesvisu` tinyint(1) NOT NULL,
  `leanvisu` tinyint(1) NOT NULL,
  `processvisu` tinyint(1) NOT NULL,
  `taskvisu` tinyint(1) NOT NULL,
  `masch_code` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `oee_percentage` double NOT NULL,
  `nutzung_percentage` double NOT NULL,
  `oee_color_below` tinyint(1) NOT NULL,
  `nutzung_color_below` tinyint(1) NOT NULL,
  `ausschuss_percenatge` double NOT NULL,
  `auss_color_below` tinyint(1) NOT NULL,
  `prod_percentage` double NOT NULL,
  `prod_color_below` tinyint(1) NOT NULL,
  `arbeitsgang_id` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `kosten_percentage` double NOT NULL,
  `daqlocation` varchar(255) DEFAULT NULL,
  `daqtime` int(11) NOT NULL DEFAULT '0',
  `daqtype` varchar(100) DEFAULT NULL,
  `daqconf` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=740 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `sd_mitarbeiter`
--

DROP TABLE IF EXISTS `sd_mitarbeiter`;
CREATE TABLE IF NOT EXISTS `sd_mitarbeiter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mitarbeiternr` int(11) NOT NULL,
  `mitarbeiterbez` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `username` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `email` text,
  `aktiv_inaktiv` tinyint(1) NOT NULL,
  `ma_art` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `bemerkung` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `dirindir` tinyint(1) NOT NULL,
  `bereich` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `abteilung` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `wochenstunden` float NOT NULL,
  `stundensatz` float DEFAULT NULL,
  `eintritt` varchar(100) NOT NULL,
  `austritt` varchar(200) NOT NULL,
  `hallenr` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `berufsbez` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `ma_gruppe` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `vollzeit_teilzeit` tinyint(1) NOT NULL,
  `vorgesetzter_flag` tinyint(1) NOT NULL,
  `vorgesetzter` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `betriebszug` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `geburtsdatum` text NOT NULL,
  `alter` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `geschlecht` tinyint(1) NOT NULL,
  `altersklassen` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `kuerzel` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `wkz_zeit` tinyint(1) NOT NULL,
  `prozesstechniker` tinyint(1) NOT NULL,
  `leantechniker` tinyint(4) NOT NULL,
  `mitarbeiter_type` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1918 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sd_mitarbeiter`
--

INSERT INTO `sd_mitarbeiter` (`id`, `mitarbeiternr`, `mitarbeiterbez`, `username`, `password`, `email`, `aktiv_inaktiv`, `ma_art`, `bemerkung`, `dirindir`, `bereich`, `abteilung`, `wochenstunden`, `stundensatz`, `eintritt`, `austritt`, `hallenr`, `berufsbez`, `ma_gruppe`, `vollzeit_teilzeit`, `vorgesetzter_flag`, `vorgesetzter`, `betriebszug`, `geburtsdatum`, `alter`, `geschlecht`, `altersklassen`, `kuerzel`, `wkz_zeit`, `prozesstechniker`, `leantechniker`, `mitarbeiter_type`) VALUES
(1, 625, 'Administrator', 'administrator', 'tommy85', 'admin@example.com', 1, '109', '', 0, '100', '127', 0, 0, '04.01.2010', '0', '-1', '', 'GH05', 0, 0, '0', '3.12', '16.09.1985', '35.4', 0, '', 'PFA', 0, 0, 0, 374);

-- --------------------------------------------------------

--
-- Table structure for table `sd_mitarbeiter_excel`
--

DROP TABLE IF EXISTS `sd_mitarbeiter_excel`;
CREATE TABLE IF NOT EXISTS `sd_mitarbeiter_excel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `PersonalNr` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dirindr` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dirindrID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Halle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `HalleNr` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1817 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sd_teile`
--

DROP TABLE IF EXISTS `sd_teile`;
CREATE TABLE IF NOT EXISTS `sd_teile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teilenr` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `teilebez_1` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `teilebez_2` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `teilebez_3` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `baugruppe` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `aktiv_inaktiv` tinyint(1) NOT NULL,
  `konzern` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `artikelgruppe` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `teileart` int(100) NOT NULL,
  `material` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `anwendung` int(100) NOT NULL,
  `verkauf_teil` varchar(500) NOT NULL,
  `maschine` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `werkzeugnr` varchar(500) NOT NULL,
  `fertigungstiefe` int(100) NOT NULL,
  `regal` text NOT NULL,
  `ebene` text NOT NULL,
  `fach` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3347 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `sd_werkzeuge`
--

DROP TABLE IF EXISTS `sd_werkzeuge`;
CREATE TABLE IF NOT EXISTS `sd_werkzeuge` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `werkzeugnr` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `werkzeugbez1` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `teilenr` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `aktiv_inaktiv` tinyint(1) NOT NULL,
  `sonstiges` tinyint(1) NOT NULL,
  `garant_stuckzahl` int(100) NOT NULL,
  `nester` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `werkzeug_generation` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `kundennr` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `verkauf_teil` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `zustand` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `baugruppe` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `regal` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `ebene` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `fach` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `lagerplatz` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `formordnernr` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `einbauhoehe` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `hoehe` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `breite` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `laenge` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `maschine` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `gesamtgewicht` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `gewicht_fahrende_seite` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `fewicht_feste_seite` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `projektnr` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `bemerkung` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `teile_gewicht` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `materialgruppe` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `materialnr` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `schliesskraft` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `pphomo` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `ppcopo` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `ppcoporandom` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `heisskanal` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `tpe` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `baujahr` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `kernzuege` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `regranulat` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `auswerfer` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `batchanteil` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `artikel_erp` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `letztes_jahr` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `marke` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `durchmesser` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `t_attachments`
--

DROP TABLE IF EXISTS `t_attachments`;
CREATE TABLE IF NOT EXISTS `t_attachments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) NOT NULL,
  `type` int(5) NOT NULL COMMENT 'type=1(teile) & type = 2 wkz',
  `name` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `original_name` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `ext` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `size` int(100) NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `is_standard` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=265 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `t_base_combo`
--

DROP TABLE IF EXISTS `t_base_combo`;
CREATE TABLE IF NOT EXISTS `t_base_combo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` int(11) NOT NULL,
  `name` varchar(500) NOT NULL,
  `goal_line_value` varchar(11) NOT NULL DEFAULT '0',
  `color` tinyint(1) NOT NULL DEFAULT '1',
  `value` varchar(500) NOT NULL,
  `dept_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=667 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `t_base_combo_type`
--

DROP TABLE IF EXISTS `t_base_combo_type`;
CREATE TABLE IF NOT EXISTS `t_base_combo_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `value` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `t_company_name`
--

DROP TABLE IF EXISTS `t_company_name`;
CREATE TABLE IF NOT EXISTS `t_company_name` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `t_report_permission`
--

DROP TABLE IF EXISTS `t_report_permission`;
CREATE TABLE IF NOT EXISTS `t_report_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mitarbeiternr` text NOT NULL,
  `type_id` text NOT NULL,
  `halle_id` text NOT NULL,
  `rep_id` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `t_stillstand`
--

DROP TABLE IF EXISTS `t_stillstand`;
CREATE TABLE IF NOT EXISTS `t_stillstand` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `halle_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gruppe_id` int(11) NOT NULL,
  `anzeigen` tinyint(1) NOT NULL,
  `color3` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `t_user_permission`
--

DROP TABLE IF EXISTS `t_user_permission`;
CREATE TABLE IF NOT EXISTS `t_user_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mitarbeiternr` varchar(200) NOT NULL,
  `user_type` varchar(3) NOT NULL,
  `basevisu` tinyint(1) NOT NULL,
  `castvisu` tinyint(1) NOT NULL,
  `mesvisu` tinyint(1) NOT NULL,
  `shiftvisu` tinyint(1) NOT NULL,
  `docvisu` tinyint(1) NOT NULL,
  `capacity` tinyint(1) NOT NULL,
  `toolvisu` tinyint(1) NOT NULL,
  `processvisu` tinyint(1) NOT NULL,
  `tpmvisu` tinyint(1) NOT NULL,
  `leanvisu` tinyint(1) NOT NULL,
  `planvisu` tinyint(1) NOT NULL,
  `shopfloor` tinyint(1) NOT NULL,
  `taskvisu` tinyint(4) NOT NULL,
  `qualivisu` tinyint(4) NOT NULL,
  `reportvisu` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=314 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `t_user_permission`
--

INSERT INTO `t_user_permission` (`id`, `mitarbeiternr`, `user_type`, `basevisu`, `castvisu`, `mesvisu`, `shiftvisu`, `docvisu`, `capacity`, `toolvisu`, `processvisu`, `tpmvisu`, `leanvisu`, `planvisu`, `shopfloor`, `taskvisu`, `qualivisu`, `reportvisu`) VALUES
(1, '625', 'a', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `t_user_permission_sidebar`
--

DROP TABLE IF EXISTS `t_user_permission_sidebar`;
CREATE TABLE IF NOT EXISTS `t_user_permission_sidebar` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mitarbeiternr` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `user_type` varchar(3) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `maschine` tinyint(4) NOT NULL,
  `teile` tinyint(4) NOT NULL,
  `werkzeuge` tinyint(4) NOT NULL,
  `mitarbeiter` tinyint(4) NOT NULL,
  `kunden` tinyint(4) NOT NULL,
  `halle` tinyint(4) NOT NULL,
  `kapazitat_plan` tinyint(4) NOT NULL,
  `lieferant` tinyint(8) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=159 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `t_user_permission_sidebar`
--

INSERT INTO `t_user_permission_sidebar` (`id`, `mitarbeiternr`, `user_type`, `maschine`, `teile`, `werkzeuge`, `mitarbeiter`, `kunden`, `halle`, `kapazitat_plan`, `lieferant`) VALUES
(1, '625', 'a', 1, 1, 1, 1, 1, 1, 1, 1);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
