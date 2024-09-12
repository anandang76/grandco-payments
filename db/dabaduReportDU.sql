-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 12, 2024 at 11:27 AM
-- Server version: 8.0.36-0ubuntu0.22.04.1
-- PHP Version: 8.1.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dabaduReportKW`
--

-- --------------------------------------------------------

--
-- Table structure for table `aqiZoneSummary`
--

CREATE TABLE `aqiZoneSummary` (
  `id` int NOT NULL,
  `locationID` int DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `facilityID` int DEFAULT NULL,
  `buildingID` int DEFAULT NULL,
  `floorID` int DEFAULT NULL,
  `zoneID` int DEFAULT NULL,
  `aqiValue` int DEFAULT NULL,
  `aqiInfo` text,
  `collectedTime` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bumpTestDeviceIncomingData`
--

CREATE TABLE `bumpTestDeviceIncomingData` (
  `id` int NOT NULL,
  `data` varchar(2048) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bumpTestInfo`
--

CREATE TABLE `bumpTestInfo` (
  `id` int NOT NULL,
  `startTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `testType` varchar(64) DEFAULT NULL,
  `gasPercentage` varchar(64) DEFAULT NULL,
  `endTime` timestamp NULL DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `info` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bumpTestReport`
--

CREATE TABLE `bumpTestReport` (
  `id` int NOT NULL,
  `locationID` int DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `facilityID` int DEFAULT NULL,
  `buildingID` int DEFAULT NULL,
  `floorID` int DEFAULT NULL,
  `zoneID` int DEFAULT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `bumpTestID` int DEFAULT NULL,
  `testType` varchar(64) DEFAULT NULL,
  `deviation` varchar(64) DEFAULT NULL,
  `result` varchar(64) DEFAULT NULL,
  `resultInfo` text,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `email` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bumpTestSensorSegregatedValues`
--

CREATE TABLE `bumpTestSensorSegregatedValues` (
  `id` int NOT NULL,
  `bumpTestID` int NOT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `sensorValue` decimal(11,5) DEFAULT NULL,
  `scaledValue` decimal(11,5) DEFAULT NULL,
  `info` varchar(16) DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `calibrationReport`
--

CREATE TABLE `calibrationReport` (
  `id` int NOT NULL,
  `locationID` int DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `facilityID` int DEFAULT NULL,
  `buildingID` int DEFAULT NULL,
  `floorID` int DEFAULT NULL,
  `zoneID` int DEFAULT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `name` text,
  `userEmail` varchar(128) DEFAULT NULL,
  `calibratedDate` timestamp NULL DEFAULT NULL,
  `result` varchar(64) DEFAULT NULL,
  `nextCalibrationDueDate` timestamp NULL DEFAULT NULL,
  `calibrationDueDate` timestamp NULL DEFAULT NULL,
  `collectedDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `eventLogReport`
--

CREATE TABLE `eventLogReport` (
  `id` int NOT NULL,
  `locationID` int DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `facilityID` int DEFAULT NULL,
  `buildingID` int DEFAULT NULL,
  `floorID` int DEFAULT NULL,
  `zoneID` int DEFAULT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `userEmail` text NOT NULL,
  `eventName` text NOT NULL,
  `eventDetails` text NOT NULL,
  `collectedDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `limitEditLogReport`
--

CREATE TABLE `limitEditLogReport` (
  `id` int NOT NULL,
  `locationID` int NOT NULL,
  `branchID` int NOT NULL,
  `facilityID` int NOT NULL,
  `buildingID` int NOT NULL,
  `floorID` int NOT NULL,
  `zoneID` int NOT NULL,
  `deviceID` int NOT NULL,
  `sensorID` int NOT NULL,
  `userEmail` text NOT NULL,
  `limits` json NOT NULL,
  `collectedDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sensorReportData`
--

CREATE TABLE `sensorReportData` (
  `id` int NOT NULL,
  `locationID` int DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `facilityID` int DEFAULT NULL,
  `buildingID` int DEFAULT NULL,
  `floorID` int DEFAULT NULL,
  `zoneID` int DEFAULT NULL,
  `deviceID` int DEFAULT NULL,
  `sensorID` int DEFAULT NULL,
  `minScaledVal` double(11,3) DEFAULT NULL,
  `maxScaledVal` double(11,3) DEFAULT NULL,
  `avgScaledVal` double(11,3) DEFAULT NULL,
  `info` varchar(16) DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `serverUsageStatitics`
--

CREATE TABLE `serverUsageStatitics` (
  `id` int NOT NULL,
  `percMemoryUsage` varchar(256) DEFAULT NULL,
  `diskUsage` varchar(256) DEFAULT NULL,
  `avgCpuLoad` varchar(256) DEFAULT NULL,
  `percServerLoad` varchar(256) DEFAULT NULL,
  `collectedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `userLogsReport`
--

CREATE TABLE `userLogsReport` (
  `id` int UNSIGNED NOT NULL,
  `locationID` int DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `facilityID` int DEFAULT NULL,
  `buildingID` int DEFAULT NULL,
  `floorID` int DEFAULT NULL,
  `zoneID` int DEFAULT NULL,
  `userID` int DEFAULT NULL,
  `userEmail` varchar(125) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyCode` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `userLogsReport`
--

INSERT INTO `userLogsReport` (`id`, `locationID`, `branchID`, `facilityID`, `buildingID`, `floorID`, `zoneID`, `userID`, `userEmail`, `companyCode`, `action`, `createdAt`, `updatedAt`) VALUES
(31, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-04-06 12:22:11', '2024-04-06 12:22:11'),
(32, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-04-06 12:52:20', '2024-04-06 12:52:20'),
(33, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-04-06 12:52:31', '2024-04-06 12:52:31'),
(34, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-04-06 12:57:29', '2024-04-06 12:57:29'),
(35, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-04-06 12:57:35', '2024-04-06 12:57:35'),
(36, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-04-06 13:19:46', '2024-04-06 13:19:46'),
(37, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-04-08 09:17:08', '2024-04-08 09:17:08'),
(38, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-04-16 13:22:16', '2024-04-16 13:22:16'),
(39, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-04-16 13:23:23', '2024-04-16 13:23:23'),
(40, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-04-16 13:23:25', '2024-04-16 13:23:25'),
(41, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-04-16 14:35:08', '2024-04-16 14:35:08'),
(42, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-04-18 05:11:51', '2024-04-18 05:11:51'),
(43, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-04-20 09:54:03', '2024-04-20 09:54:03'),
(44, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-04-22 14:19:40', '2024-04-22 14:19:40'),
(45, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-04-24 14:41:24', '2024-04-24 14:41:24'),
(46, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-04-24 14:58:02', '2024-04-24 14:58:02'),
(47, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-04-24 15:04:57', '2024-04-24 15:04:57'),
(48, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-05-07 08:53:50', '2024-05-07 08:53:50'),
(49, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-05-07 08:53:50', '2024-05-07 08:53:50'),
(50, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-05-08 09:14:43', '2024-05-08 09:14:43'),
(51, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-05-17 13:22:56', '2024-05-17 13:22:56'),
(52, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-05-17 13:23:01', '2024-05-17 13:23:01'),
(53, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-05-30 15:05:24', '2024-05-30 15:05:24'),
(54, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-05-30 16:46:36', '2024-05-30 16:46:36'),
(55, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-05-30 16:47:23', '2024-05-30 16:47:23'),
(56, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-05-30 18:04:12', '2024-05-30 18:04:12'),
(57, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-05-31 14:32:23', '2024-05-31 14:32:23'),
(58, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-06-03 15:56:30', '2024-06-03 15:56:30'),
(59, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-06-03 16:01:00', '2024-06-03 16:01:00'),
(60, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-06-06 13:08:09', '2024-06-06 13:08:09'),
(61, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-06-06 13:17:36', '2024-06-06 13:17:36'),
(62, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-06-06 13:31:49', '2024-06-06 13:31:49'),
(63, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-06-12 13:42:07', '2024-06-12 13:42:07'),
(64, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-06-12 13:44:36', '2024-06-12 13:44:36'),
(65, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-06-14 12:39:52', '2024-06-14 12:39:52'),
(66, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-07-18 10:43:20', '2024-07-18 10:43:20'),
(67, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-08-13 11:13:26', '2024-08-13 11:13:26'),
(68, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-08-13 11:13:54', '2024-08-13 11:13:54'),
(69, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-08-13 11:29:40', '2024-08-13 11:29:40'),
(70, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-08-13 11:31:13', '2024-08-13 11:31:13'),
(71, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-08-13 11:31:17', '2024-08-13 11:31:17'),
(72, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-08-16 16:48:15', '2024-08-16 16:48:15'),
(73, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-08-16 16:51:12', '2024-08-16 16:51:12'),
(74, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-08-16 16:51:43', '2024-08-16 16:51:43'),
(75, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-08-29 15:01:41', '2024-08-29 15:01:41'),
(76, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-08-29 15:38:37', '2024-08-29 15:38:37'),
(77, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-08-29 15:56:38', '2024-08-29 15:56:38'),
(78, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-08-29 16:02:15', '2024-08-29 16:02:15'),
(79, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-08-29 18:03:41', '2024-08-29 18:03:41'),
(80, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-08-29 18:20:28', '2024-08-29 18:20:28'),
(81, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-04 04:39:14', '2024-09-04 04:39:14'),
(82, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-05 05:42:58', '2024-09-05 05:42:58'),
(83, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-05 05:55:09', '2024-09-05 05:55:09'),
(84, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-05 06:05:47', '2024-09-05 06:05:47'),
(85, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-05 07:03:08', '2024-09-05 07:03:08'),
(86, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-05 07:18:53', '2024-09-05 07:18:53'),
(87, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-09-05 10:22:15', '2024-09-05 10:22:15'),
(88, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-05 10:42:07', '2024-09-05 10:42:07'),
(89, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-06 02:28:44', '2024-09-06 02:28:44'),
(90, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-06 04:38:51', '2024-09-06 04:38:51'),
(91, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-09-06 06:04:32', '2024-09-06 06:04:32'),
(92, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-06 06:04:43', '2024-09-06 06:04:43'),
(93, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-09-06 06:44:57', '2024-09-06 06:44:57'),
(94, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-06 07:15:45', '2024-09-06 07:15:45'),
(95, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-06 08:59:48', '2024-09-06 08:59:48'),
(96, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-06 09:02:25', '2024-09-06 09:02:25'),
(97, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-06 09:02:51', '2024-09-06 09:02:51'),
(98, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-06 09:06:44', '2024-09-06 09:06:44'),
(99, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-06 09:15:03', '2024-09-06 09:15:03'),
(100, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-06 10:02:54', '2024-09-06 10:02:54'),
(101, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-09-06 10:04:01', '2024-09-06 10:04:01'),
(102, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-06 11:28:55', '2024-09-06 11:28:55'),
(103, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-09-06 12:18:49', '2024-09-06 12:18:49'),
(104, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-06 16:20:28', '2024-09-06 16:20:28'),
(105, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-06 16:54:59', '2024-09-06 16:54:59'),
(106, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-07 13:04:06', '2024-09-07 13:04:06'),
(107, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-09-07 14:59:36', '2024-09-07 14:59:36'),
(108, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-08 01:40:16', '2024-09-08 01:40:16'),
(109, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-09-08 01:42:37', '2024-09-08 01:42:37'),
(110, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-08 10:45:11', '2024-09-08 10:45:11'),
(111, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-09-08 10:52:33', '2024-09-08 10:52:33'),
(112, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-09 00:52:45', '2024-09-09 00:52:45'),
(113, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-09-09 02:39:23', '2024-09-09 02:39:23'),
(114, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-09 04:03:01', '2024-09-09 04:03:01'),
(115, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-09-09 04:03:55', '2024-09-09 04:03:55'),
(116, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-10 13:38:44', '2024-09-10 13:38:44'),
(117, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-09-10 13:38:58', '2024-09-10 13:38:58'),
(118, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-11 14:25:38', '2024-09-11 14:25:38'),
(119, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-09-11 15:01:18', '2024-09-11 15:01:18'),
(120, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-12 06:12:29', '2024-09-12 06:12:29'),
(121, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-09-12 06:21:47', '2024-09-12 06:21:47'),
(122, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-12 06:22:08', '2024-09-12 06:22:08'),
(123, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-12 09:04:31', '2024-09-12 09:04:31'),
(124, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-09-12 09:16:31', '2024-09-12 09:16:31'),
(125, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedIn', '2024-09-12 09:16:33', '2024-09-12 09:16:33'),
(126, NULL, NULL, NULL, NULL, NULL, NULL, 315, 'admin@dabadu.com', NULL, 'LoggedOut', '2024-09-12 09:18:34', '2024-09-12 09:18:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aqiZoneSummary`
--
ALTER TABLE `aqiZoneSummary`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bumpTestDeviceIncomingData`
--
ALTER TABLE `bumpTestDeviceIncomingData`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bumpTestInfo`
--
ALTER TABLE `bumpTestInfo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bumpTestReport`
--
ALTER TABLE `bumpTestReport`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bumpTestSensorSegregatedValues`
--
ALTER TABLE `bumpTestSensorSegregatedValues`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `calibrationReport`
--
ALTER TABLE `calibrationReport`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `eventLogReport`
--
ALTER TABLE `eventLogReport`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `limitEditLogReport`
--
ALTER TABLE `limitEditLogReport`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sensorReportData`
--
ALTER TABLE `sensorReportData`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `serverUsageStatitics`
--
ALTER TABLE `serverUsageStatitics`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userLogsReport`
--
ALTER TABLE `userLogsReport`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aqiZoneSummary`
--
ALTER TABLE `aqiZoneSummary`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bumpTestDeviceIncomingData`
--
ALTER TABLE `bumpTestDeviceIncomingData`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bumpTestInfo`
--
ALTER TABLE `bumpTestInfo`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bumpTestReport`
--
ALTER TABLE `bumpTestReport`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bumpTestSensorSegregatedValues`
--
ALTER TABLE `bumpTestSensorSegregatedValues`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `calibrationReport`
--
ALTER TABLE `calibrationReport`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `eventLogReport`
--
ALTER TABLE `eventLogReport`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `limitEditLogReport`
--
ALTER TABLE `limitEditLogReport`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sensorReportData`
--
ALTER TABLE `sensorReportData`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `serverUsageStatitics`
--
ALTER TABLE `serverUsageStatitics`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `userLogsReport`
--
ALTER TABLE `userLogsReport`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=127;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
