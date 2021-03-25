-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3308
-- Generation Time: Mar 25, 2021 at 06:48 AM
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
-- Database: `capacity_planning`
--

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `getShiftBasedOnPreviousDate`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getShiftBasedOnPreviousDate` (IN `m_nr` VARCHAR(255), IN `predate` VARCHAR(255), IN `hour` VARCHAR(255))  BEGIN


(SELECT DISTINCT t2.date, t3.id as shift_id,t3.shift_code ,t3.shift_name,t3.total_hours AS `total_hours`,
 t4.hour, t3.starttime, t3.endtime,t4.status,t1.is_working,t2.date as actual_date, '' as nr_bez, '' as date_f , t3.calculate
 FROM ((t_capacity t1 left join t_calender t2 on t1.date_id = t2.id
        left join sd_shift_details t3 on t1.shift_id = t3.shift_id)
       left join sd_shift_hour_type t4 on  t3.id = t4.shift_id) 
 where t1.maschine_nr = (select id from base_visu.sd_maschine 
                         where maschinenr = m_nr) 
 AND t4.hour = hour
 and t2.date = predate)
;

END$$

DROP PROCEDURE IF EXISTS `getShiftBasedOnTime`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getShiftBasedOnTime` (IN `m_nr` VARCHAR(255), IN `startdate` VARCHAR(255), IN `enddate` VARCHAR(255))  BEGIN
    SELECT DISTINCT t2.date, t3.id AS shift_id, t3.shift_code, t3.shift_name, t3.total_hours AS total_hours , t4.hour , t3.starttime, t3.endtime, t4.status, t1.is_working, t2.date AS actual_date, '' AS nr_bez, '' AS date_f, t3.calculate
FROM (
(
    t_capacity t1
LEFT JOIN t_calender t2 ON t1.date_id = t2.id
LEFT JOIN sd_shift_details t3 ON t1.shift_id = t3.shift_id
)
LEFT JOIN sd_shift_hour_type t4 ON t3.id = t4.shift_id
)
WHERE t1.maschine_nr = (
SELECT id
FROM base_visu.sd_maschine
WHERE maschinenr = m_nr )
AND CONCAT( t2.date, ' ', t4.hour ) >= startdate
AND CONCAT( t2.date, ' ', t4.hour ) <= enddate
ORDER BY t4.hour ASC;

END$$

DROP PROCEDURE IF EXISTS `get_masch_shift_v2`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_masch_shift_v2` (IN `m_nr` VARCHAR(255), IN `startdate` VARCHAR(255), IN `enddate` VARCHAR(255))  BEGIN



(SELECT
  t1.date AS date,
  t1.id AS shift_id,
  t1.shift_code,
  t1.shift_name,
  t1.total_hours,
  t1.hour,
  t1.starttime,
  t1.endtime,
  t1.status,
  t1.is_working,
  t1.date AS actual_date,
  Concat(t1.shift_code, ' - ', t1.shift_name) AS nr_bez,
  Date_format(t1.actual_date, '%d-%m-%Y') AS date_f,
  t1.calculate
FROM
  (
    SELECT
      h.hour,
      t3.date,
      s.*,
      h.status,
      t2.`date_id` AS `date_id`,
      t2.`company_name` AS `company_name`,
      t2.`halle` AS `halle`,
      t2.is_working as is_working,
      t2.maschine_nr as m_nr,
      (
        CASE WHEN h.status = -1 THEN Date_add(t3.date, INTERVAL 1 day) ELSE t3.date end
      ) AS actual_date,
      t2.`year` AS `year`
    FROM
      (
        (
          `t_capacity` t2
          LEFT JOIN `t_calender` t3 ON t2.`date_id` = t3.`id`
        ) 
        LEFT JOIN `sd_shift_model` t4 ON t2.`shift_id` = t4.`id`
      ) 
      LEFT JOIN sd_shift_details s ON t2.shift_id = s.shift_id
      RIGHT JOIN sd_shift_hour_type h ON s.id = h.shift_id
      where t2.maschine_nr  =  (SELECT
          id
        FROM
          base_visu.sd_maschine
        WHERE
          maschinenr = m_nr)
  ) AS t1
WHERE
  (
    Concat(t1.actual_date, ' ', hour) COLLATE utf8mb4_unicode_ci >= startdate
    AND Concat(t1.actual_date, ' ', hour) COLLATE utf8mb4_unicode_ci <= enddate
  )
GROUP BY
  shift_code);




END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `sd_color`
--

DROP TABLE IF EXISTS `sd_color`;
CREATE TABLE IF NOT EXISTS `sd_color` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `color` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL DEFAULT 'green',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sd_shift_details`
--

DROP TABLE IF EXISTS `sd_shift_details`;
CREATE TABLE IF NOT EXISTS `sd_shift_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shift_name` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `shift_id` int(11) NOT NULL COMMENT 'shift_modelID',
  `shift_code` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `starttime` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `endtime` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `total_hours` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `calculate` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sd_shift_hour_type`
--

DROP TABLE IF EXISTS `sd_shift_hour_type`;
CREATE TABLE IF NOT EXISTS `sd_shift_hour_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shift_id` int(11) NOT NULL,
  `hour` varchar(100) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sd_shift_model`
--

DROP TABLE IF EXISTS `sd_shift_model`;
CREATE TABLE IF NOT EXISTS `sd_shift_model` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shift_name` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `shift_color` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `shift_count` int(11) NOT NULL,
  `total_hours` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `calculate` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `t_calender`
--

DROP TABLE IF EXISTS `t_calender`;
CREATE TABLE IF NOT EXISTS `t_calender` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `day` varchar(20) NOT NULL,
  `month` int(11) NOT NULL,
  `week` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `is_working` tinyint(1) NOT NULL,
  `note` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `t_capacity`
--

DROP TABLE IF EXISTS `t_capacity`;
CREATE TABLE IF NOT EXISTS `t_capacity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_id` int(11) NOT NULL,
  `shift_id` int(11) NOT NULL COMMENT 'shift_modelID',
  `company_name` text,
  `halle` varchar(100) DEFAULT NULL,
  `maschine_nr` varchar(200) DEFAULT NULL,
  `year` int(11) NOT NULL,
  `is_working` tinyint(1) NOT NULL DEFAULT '1',
  `is_updated` tinyint(1) NOT NULL DEFAULT '0',
  `event_name` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `t_capacity_old`
--

DROP TABLE IF EXISTS `t_capacity_old`;
CREATE TABLE IF NOT EXISTS `t_capacity_old` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_id` int(11) NOT NULL,
  `shift_id` int(11) NOT NULL COMMENT 'shift_modelID',
  `company_name` text,
  `halle` varchar(100) DEFAULT NULL,
  `maschine_nr` varchar(200) DEFAULT NULL,
  `year` int(11) NOT NULL,
  `is_working` tinyint(1) NOT NULL DEFAULT '1',
  `is_updated` tinyint(1) NOT NULL DEFAULT '0',
  `event_name` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_t_capacity_details`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `view_t_capacity_details`;
CREATE TABLE IF NOT EXISTS `view_t_capacity_details` (
`company_name` text
,`date` date
,`date_id` int(11)
,`day` varchar(20)
,`event_name` varchar(100)
,`halle` varchar(100)
,`id` int(11)
,`is_working` tinyint(1)
,`Jahr_KW` varchar(23)
,`Jahr_Monat` varchar(23)
,`m_nr` varchar(500)
,`maschine_nr` varchar(200)
,`month` int(11)
,`shift_color` varchar(10)
,`shift_id` int(11)
,`shift_name` varchar(200)
,`total_hours` varchar(200)
,`week` int(11)
,`year` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_shift_masch_hour`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `v_shift_masch_hour`;
CREATE TABLE IF NOT EXISTS `v_shift_masch_hour` (
`calculate` tinyint(1)
,`company_name` text
,`date` date
,`date_id` int(11)
,`endtime` varchar(10)
,`halle` varchar(100)
,`hour` varchar(100)
,`is_working` tinyint(1)
,`m_nr` varchar(500)
,`maschine_nr` varchar(200)
,`shift_code` varchar(200)
,`shift_id` int(11)
,`shift_name` varchar(200)
,`starttime` varchar(10)
,`status` int(11)
,`total_hours` varchar(200)
,`week` int(11)
);

-- --------------------------------------------------------

--
-- Structure for view `view_t_capacity_details`
--
DROP TABLE IF EXISTS `view_t_capacity_details`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_t_capacity_details`  AS  select `t_capacity`.`id` AS `id`,`t_capacity`.`date_id` AS `date_id`,`t_capacity`.`event_name` AS `event_name`,`t_capacity`.`shift_id` AS `shift_id`,`t_capacity`.`company_name` AS `company_name`,`t_capacity`.`halle` AS `halle`,`t_capacity`.`maschine_nr` AS `maschine_nr`,(select `base_visu`.`sd_maschine`.`maschinenr` from `base_visu`.`sd_maschine` where (`base_visu`.`sd_maschine`.`id` = `t_capacity`.`maschine_nr`)) AS `m_nr`,`t_capacity`.`year` AS `year`,`t_capacity`.`is_working` AS `is_working`,`t_calender`.`date` AS `date`,`t_calender`.`day` AS `day`,`t_calender`.`month` AS `month`,`t_calender`.`week` AS `week`,concat(`t_capacity`.`year`,'-',`t_calender`.`week`) AS `Jahr_KW`,concat(`t_capacity`.`year`,'-',`t_calender`.`month`) AS `Jahr_Monat`,`sd_shift_model`.`shift_color` AS `shift_color`,`sd_shift_model`.`shift_name` AS `shift_name`,`sd_shift_model`.`total_hours` AS `total_hours` from ((`t_capacity` left join `t_calender` on((`t_capacity`.`date_id` = `t_calender`.`id`))) left join `sd_shift_model` on((`t_capacity`.`shift_id` = `sd_shift_model`.`id`))) ;

-- --------------------------------------------------------

--
-- Structure for view `v_shift_masch_hour`
--
DROP TABLE IF EXISTS `v_shift_masch_hour`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_shift_masch_hour`  AS  select `v`.`company_name` AS `company_name`,`v`.`halle` AS `halle`,`v`.`maschine_nr` AS `maschine_nr`,(select `base_visu`.`sd_maschine`.`maschinenr` from `base_visu`.`sd_maschine` where (`base_visu`.`sd_maschine`.`id` = `v`.`maschine_nr`)) AS `m_nr`,`v`.`is_working` AS `is_working`,`v`.`date_id` AS `date_id`,`v`.`date` AS `date`,`v`.`week` AS `week`,`s`.`id` AS `shift_id`,`s`.`shift_name` AS `shift_name`,`s`.`shift_code` AS `shift_code`,`s`.`starttime` AS `starttime`,`s`.`endtime` AS `endtime`,`s`.`total_hours` AS `total_hours`,`s`.`calculate` AS `calculate`,`t`.`hour` AS `hour`,`t`.`status` AS `status` from ((`view_t_capacity_details` `v` left join `sd_shift_details` `s` on((`v`.`shift_id` = `s`.`shift_id`))) left join `sd_shift_hour_type` `t` on((`s`.`id` = `t`.`shift_id`))) ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
