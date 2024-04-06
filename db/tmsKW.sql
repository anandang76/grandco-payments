-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 20, 2024 at 11:28 AM
-- Server version: 8.0.35-0ubuntu0.22.04.1
-- PHP Version: 8.1.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tmsKW`
--

-- --------------------------------------------------------

--
-- Table structure for table `alertCrons`
--

CREATE TABLE `alertCrons` (
  `id` int NOT NULL,
  `locationID` int DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `facilityID` int DEFAULT NULL,
  `buildingID` int DEFAULT NULL,
  `floorID` int DEFAULT NULL,
  `zoneID` int DEFAULT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `deviceName` varchar(64) DEFAULT NULL,
  `sensorTag` varchar(64) DEFAULT NULL,
  `shiftID` varchar(16) DEFAULT NULL COMMENT 'Only for TWA',
  `alertType` varchar(128) DEFAULT NULL,
  `value` decimal(11,3) DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `closedTime` timestamp NULL DEFAULT NULL,
  `diffMinutes` varchar(16) DEFAULT NULL,
  `msg` varchar(128) DEFAULT NULL,
  `severity` varchar(64) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `emailSent` tinyint(1) DEFAULT NULL,
  `textMessageSent` tinyint(1) DEFAULT NULL,
  `notificationShow` int DEFAULT NULL,
  `statusMessage` varchar(128) DEFAULT NULL,
  `Reason` varchar(256) DEFAULT NULL,
  `alarmType` varchar(64) DEFAULT NULL,
  `alertStandardMessage` varchar(1024) DEFAULT NULL,
  `alertTriggeredDuration` varchar(64) DEFAULT NULL,
  `alertCategory` varchar(64) DEFAULT NULL,
  `triggeredAlertFlag` varchar(11) DEFAULT NULL,
  `timeDurations` varchar(64) DEFAULT NULL,
  `alarmClearedUser` varchar(128) DEFAULT NULL,
  `alertCheckStatus` int DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `aqiZoneInfo`
--

CREATE TABLE `aqiZoneInfo` (
  `id` int NOT NULL,
  `zoneID` int DEFAULT NULL,
  `aqiValue` decimal(8,3) DEFAULT NULL,
  `aqiInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `collectedTime` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceIncomingData`
--

CREATE TABLE `deviceIncomingData` (
  `id` int NOT NULL,
  `data` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceIncomingDataBumpTest`
--

CREATE TABLE `deviceIncomingDataBumpTest` (
  `id` int NOT NULL,
  `data` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceIncomingDataDebug`
--

CREATE TABLE `deviceIncomingDataDebug` (
  `id` int NOT NULL,
  `data` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_0_1`
--

CREATE TABLE `deviceSensorData_0_1` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_0_5`
--

CREATE TABLE `deviceSensorData_0_5` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_0_10`
--

CREATE TABLE `deviceSensorData_0_10` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_0_15`
--

CREATE TABLE `deviceSensorData_0_15` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_0_30`
--

CREATE TABLE `deviceSensorData_0_30` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_0_60`
--

CREATE TABLE `deviceSensorData_0_60` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_1_1`
--

CREATE TABLE `deviceSensorData_1_1` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_1_5`
--

CREATE TABLE `deviceSensorData_1_5` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_1_10`
--

CREATE TABLE `deviceSensorData_1_10` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_1_15`
--

CREATE TABLE `deviceSensorData_1_15` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_1_30`
--

CREATE TABLE `deviceSensorData_1_30` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_1_60`
--

CREATE TABLE `deviceSensorData_1_60` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_2_1`
--

CREATE TABLE `deviceSensorData_2_1` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_2_5`
--

CREATE TABLE `deviceSensorData_2_5` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_2_10`
--

CREATE TABLE `deviceSensorData_2_10` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_2_15`
--

CREATE TABLE `deviceSensorData_2_15` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_2_30`
--

CREATE TABLE `deviceSensorData_2_30` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_2_60`
--

CREATE TABLE `deviceSensorData_2_60` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_3_1`
--

CREATE TABLE `deviceSensorData_3_1` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_3_5`
--

CREATE TABLE `deviceSensorData_3_5` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_3_10`
--

CREATE TABLE `deviceSensorData_3_10` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_3_15`
--

CREATE TABLE `deviceSensorData_3_15` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_3_30`
--

CREATE TABLE `deviceSensorData_3_30` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_3_60`
--

CREATE TABLE `deviceSensorData_3_60` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_4_1`
--

CREATE TABLE `deviceSensorData_4_1` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_4_5`
--

CREATE TABLE `deviceSensorData_4_5` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_4_10`
--

CREATE TABLE `deviceSensorData_4_10` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_4_15`
--

CREATE TABLE `deviceSensorData_4_15` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_4_30`
--

CREATE TABLE `deviceSensorData_4_30` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_4_60`
--

CREATE TABLE `deviceSensorData_4_60` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_5_1`
--

CREATE TABLE `deviceSensorData_5_1` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_5_5`
--

CREATE TABLE `deviceSensorData_5_5` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_5_10`
--

CREATE TABLE `deviceSensorData_5_10` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_5_15`
--

CREATE TABLE `deviceSensorData_5_15` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_5_30`
--

CREATE TABLE `deviceSensorData_5_30` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_5_60`
--

CREATE TABLE `deviceSensorData_5_60` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_6_1`
--

CREATE TABLE `deviceSensorData_6_1` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_6_5`
--

CREATE TABLE `deviceSensorData_6_5` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_6_10`
--

CREATE TABLE `deviceSensorData_6_10` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_6_15`
--

CREATE TABLE `deviceSensorData_6_15` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_6_30`
--

CREATE TABLE `deviceSensorData_6_30` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_6_60`
--

CREATE TABLE `deviceSensorData_6_60` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_7_1`
--

CREATE TABLE `deviceSensorData_7_1` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_7_5`
--

CREATE TABLE `deviceSensorData_7_5` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_7_10`
--

CREATE TABLE `deviceSensorData_7_10` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_7_15`
--

CREATE TABLE `deviceSensorData_7_15` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_7_30`
--

CREATE TABLE `deviceSensorData_7_30` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_7_60`
--

CREATE TABLE `deviceSensorData_7_60` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_8_1`
--

CREATE TABLE `deviceSensorData_8_1` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_8_5`
--

CREATE TABLE `deviceSensorData_8_5` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_8_10`
--

CREATE TABLE `deviceSensorData_8_10` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_8_15`
--

CREATE TABLE `deviceSensorData_8_15` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_8_30`
--

CREATE TABLE `deviceSensorData_8_30` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_8_60`
--

CREATE TABLE `deviceSensorData_8_60` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_9_1`
--

CREATE TABLE `deviceSensorData_9_1` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_9_5`
--

CREATE TABLE `deviceSensorData_9_5` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_9_10`
--

CREATE TABLE `deviceSensorData_9_10` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_9_15`
--

CREATE TABLE `deviceSensorData_9_15` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_9_30`
--

CREATE TABLE `deviceSensorData_9_30` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deviceSensorData_9_60`
--

CREATE TABLE `deviceSensorData_9_60` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dynamicValues`
--

CREATE TABLE `dynamicValues` (
  `id` int NOT NULL,
  `type` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dynamicValues`
--

INSERT INTO `dynamicValues` (`id`, `type`, `data`, `createdAt`, `modifiedAt`) VALUES
(1, 'SENSOR_DYNAMIC_DATA', '', '2023-12-27 14:14:00', '2024-02-19 07:48:05');

-- --------------------------------------------------------

--
-- Table structure for table `sensorSegregatedValues`
--

CREATE TABLE `sensorSegregatedValues` (
  `id` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `sensorTag` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sensorValue` decimal(11,5) DEFAULT NULL,
  `scaledValue` decimal(11,5) DEFAULT NULL,
  `info` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `twaInfo`
--

CREATE TABLE `twaInfo` (
  `id` int NOT NULL,
  `sensorID` int DEFAULT NULL,
  `deviceID` int DEFAULT NULL,
  `shiftID` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `currentValue` decimal(8,4) DEFAULT NULL,
  `info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `calculatedDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alertCrons`
--
ALTER TABLE `alertCrons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `aqiZoneInfo`
--
ALTER TABLE `aqiZoneInfo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceIncomingData`
--
ALTER TABLE `deviceIncomingData`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceIncomingDataBumpTest`
--
ALTER TABLE `deviceIncomingDataBumpTest`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceIncomingDataDebug`
--
ALTER TABLE `deviceIncomingDataDebug`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_0_1`
--
ALTER TABLE `deviceSensorData_0_1`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_0_5`
--
ALTER TABLE `deviceSensorData_0_5`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_0_10`
--
ALTER TABLE `deviceSensorData_0_10`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_0_15`
--
ALTER TABLE `deviceSensorData_0_15`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_0_30`
--
ALTER TABLE `deviceSensorData_0_30`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_0_60`
--
ALTER TABLE `deviceSensorData_0_60`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_1_1`
--
ALTER TABLE `deviceSensorData_1_1`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_1_5`
--
ALTER TABLE `deviceSensorData_1_5`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_1_10`
--
ALTER TABLE `deviceSensorData_1_10`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_1_15`
--
ALTER TABLE `deviceSensorData_1_15`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_1_30`
--
ALTER TABLE `deviceSensorData_1_30`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_1_60`
--
ALTER TABLE `deviceSensorData_1_60`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_2_1`
--
ALTER TABLE `deviceSensorData_2_1`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_2_5`
--
ALTER TABLE `deviceSensorData_2_5`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_2_10`
--
ALTER TABLE `deviceSensorData_2_10`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_2_15`
--
ALTER TABLE `deviceSensorData_2_15`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_2_30`
--
ALTER TABLE `deviceSensorData_2_30`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_2_60`
--
ALTER TABLE `deviceSensorData_2_60`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_3_1`
--
ALTER TABLE `deviceSensorData_3_1`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_3_5`
--
ALTER TABLE `deviceSensorData_3_5`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_3_10`
--
ALTER TABLE `deviceSensorData_3_10`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_3_15`
--
ALTER TABLE `deviceSensorData_3_15`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_3_30`
--
ALTER TABLE `deviceSensorData_3_30`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_3_60`
--
ALTER TABLE `deviceSensorData_3_60`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_4_1`
--
ALTER TABLE `deviceSensorData_4_1`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_4_5`
--
ALTER TABLE `deviceSensorData_4_5`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_4_10`
--
ALTER TABLE `deviceSensorData_4_10`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_4_15`
--
ALTER TABLE `deviceSensorData_4_15`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_4_30`
--
ALTER TABLE `deviceSensorData_4_30`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_4_60`
--
ALTER TABLE `deviceSensorData_4_60`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_5_1`
--
ALTER TABLE `deviceSensorData_5_1`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_5_5`
--
ALTER TABLE `deviceSensorData_5_5`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_5_10`
--
ALTER TABLE `deviceSensorData_5_10`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_5_15`
--
ALTER TABLE `deviceSensorData_5_15`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_5_30`
--
ALTER TABLE `deviceSensorData_5_30`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_5_60`
--
ALTER TABLE `deviceSensorData_5_60`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_6_1`
--
ALTER TABLE `deviceSensorData_6_1`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_6_5`
--
ALTER TABLE `deviceSensorData_6_5`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_6_10`
--
ALTER TABLE `deviceSensorData_6_10`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_6_15`
--
ALTER TABLE `deviceSensorData_6_15`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_6_30`
--
ALTER TABLE `deviceSensorData_6_30`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_6_60`
--
ALTER TABLE `deviceSensorData_6_60`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_7_1`
--
ALTER TABLE `deviceSensorData_7_1`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_7_5`
--
ALTER TABLE `deviceSensorData_7_5`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_7_10`
--
ALTER TABLE `deviceSensorData_7_10`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_7_15`
--
ALTER TABLE `deviceSensorData_7_15`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_7_30`
--
ALTER TABLE `deviceSensorData_7_30`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_7_60`
--
ALTER TABLE `deviceSensorData_7_60`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_8_1`
--
ALTER TABLE `deviceSensorData_8_1`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_8_5`
--
ALTER TABLE `deviceSensorData_8_5`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_8_10`
--
ALTER TABLE `deviceSensorData_8_10`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_8_15`
--
ALTER TABLE `deviceSensorData_8_15`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_8_30`
--
ALTER TABLE `deviceSensorData_8_30`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_8_60`
--
ALTER TABLE `deviceSensorData_8_60`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_9_1`
--
ALTER TABLE `deviceSensorData_9_1`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_9_5`
--
ALTER TABLE `deviceSensorData_9_5`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_9_10`
--
ALTER TABLE `deviceSensorData_9_10`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_9_15`
--
ALTER TABLE `deviceSensorData_9_15`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_9_30`
--
ALTER TABLE `deviceSensorData_9_30`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deviceSensorData_9_60`
--
ALTER TABLE `deviceSensorData_9_60`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dynamicValues`
--
ALTER TABLE `dynamicValues`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sensorSegregatedValues`
--
ALTER TABLE `sensorSegregatedValues`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `twaInfo`
--
ALTER TABLE `twaInfo`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alertCrons`
--
ALTER TABLE `alertCrons`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `aqiZoneInfo`
--
ALTER TABLE `aqiZoneInfo`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceIncomingData`
--
ALTER TABLE `deviceIncomingData`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceIncomingDataBumpTest`
--
ALTER TABLE `deviceIncomingDataBumpTest`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceIncomingDataDebug`
--
ALTER TABLE `deviceIncomingDataDebug`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_0_1`
--
ALTER TABLE `deviceSensorData_0_1`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_0_5`
--
ALTER TABLE `deviceSensorData_0_5`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_0_10`
--
ALTER TABLE `deviceSensorData_0_10`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_0_15`
--
ALTER TABLE `deviceSensorData_0_15`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_0_30`
--
ALTER TABLE `deviceSensorData_0_30`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_0_60`
--
ALTER TABLE `deviceSensorData_0_60`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_1_1`
--
ALTER TABLE `deviceSensorData_1_1`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_1_5`
--
ALTER TABLE `deviceSensorData_1_5`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_1_10`
--
ALTER TABLE `deviceSensorData_1_10`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_1_15`
--
ALTER TABLE `deviceSensorData_1_15`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_1_30`
--
ALTER TABLE `deviceSensorData_1_30`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_1_60`
--
ALTER TABLE `deviceSensorData_1_60`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_2_1`
--
ALTER TABLE `deviceSensorData_2_1`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_2_5`
--
ALTER TABLE `deviceSensorData_2_5`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_2_10`
--
ALTER TABLE `deviceSensorData_2_10`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_2_15`
--
ALTER TABLE `deviceSensorData_2_15`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_2_30`
--
ALTER TABLE `deviceSensorData_2_30`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_2_60`
--
ALTER TABLE `deviceSensorData_2_60`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_3_1`
--
ALTER TABLE `deviceSensorData_3_1`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_3_5`
--
ALTER TABLE `deviceSensorData_3_5`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_3_10`
--
ALTER TABLE `deviceSensorData_3_10`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_3_15`
--
ALTER TABLE `deviceSensorData_3_15`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_3_30`
--
ALTER TABLE `deviceSensorData_3_30`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_3_60`
--
ALTER TABLE `deviceSensorData_3_60`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_4_1`
--
ALTER TABLE `deviceSensorData_4_1`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_4_5`
--
ALTER TABLE `deviceSensorData_4_5`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_4_10`
--
ALTER TABLE `deviceSensorData_4_10`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_4_15`
--
ALTER TABLE `deviceSensorData_4_15`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_4_30`
--
ALTER TABLE `deviceSensorData_4_30`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_4_60`
--
ALTER TABLE `deviceSensorData_4_60`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_5_1`
--
ALTER TABLE `deviceSensorData_5_1`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_5_5`
--
ALTER TABLE `deviceSensorData_5_5`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_5_10`
--
ALTER TABLE `deviceSensorData_5_10`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_5_15`
--
ALTER TABLE `deviceSensorData_5_15`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_5_30`
--
ALTER TABLE `deviceSensorData_5_30`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_5_60`
--
ALTER TABLE `deviceSensorData_5_60`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_6_1`
--
ALTER TABLE `deviceSensorData_6_1`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_6_5`
--
ALTER TABLE `deviceSensorData_6_5`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_6_10`
--
ALTER TABLE `deviceSensorData_6_10`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_6_15`
--
ALTER TABLE `deviceSensorData_6_15`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_6_30`
--
ALTER TABLE `deviceSensorData_6_30`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_6_60`
--
ALTER TABLE `deviceSensorData_6_60`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_7_1`
--
ALTER TABLE `deviceSensorData_7_1`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_7_5`
--
ALTER TABLE `deviceSensorData_7_5`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_7_10`
--
ALTER TABLE `deviceSensorData_7_10`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_7_15`
--
ALTER TABLE `deviceSensorData_7_15`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_7_30`
--
ALTER TABLE `deviceSensorData_7_30`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_7_60`
--
ALTER TABLE `deviceSensorData_7_60`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_8_1`
--
ALTER TABLE `deviceSensorData_8_1`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_8_5`
--
ALTER TABLE `deviceSensorData_8_5`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_8_10`
--
ALTER TABLE `deviceSensorData_8_10`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_8_15`
--
ALTER TABLE `deviceSensorData_8_15`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_8_30`
--
ALTER TABLE `deviceSensorData_8_30`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_8_60`
--
ALTER TABLE `deviceSensorData_8_60`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_9_1`
--
ALTER TABLE `deviceSensorData_9_1`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_9_5`
--
ALTER TABLE `deviceSensorData_9_5`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_9_10`
--
ALTER TABLE `deviceSensorData_9_10`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_9_15`
--
ALTER TABLE `deviceSensorData_9_15`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_9_30`
--
ALTER TABLE `deviceSensorData_9_30`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deviceSensorData_9_60`
--
ALTER TABLE `deviceSensorData_9_60`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dynamicValues`
--
ALTER TABLE `dynamicValues`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sensorSegregatedValues`
--
ALTER TABLE `sensorSegregatedValues`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `twaInfo`
--
ALTER TABLE `twaInfo`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
