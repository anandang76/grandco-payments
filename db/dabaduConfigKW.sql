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
-- Database: `dabaduConfigKW`
--

-- --------------------------------------------------------

--
-- Table structure for table `applicationVersions`
--

CREATE TABLE `applicationVersions` (
  `id` int UNSIGNED NOT NULL,
  `versionNumber` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `summary` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userManual` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `modifiedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `applicationVersions`
--

INSERT INTO `applicationVersions` (`id`, `versionNumber`, `summary`, `userManual`, `createdAt`, `modifiedAt`) VALUES
(9, '1.0', 'Initial Version', NULL, '2022-11-18 11:31:59', '2022-12-24 10:25:07'),
(14, '1.3', 'Second Version', NULL, '2022-12-24 11:00:15', '2023-01-18 15:04:12'),
(15, '1.4', 'Third Version', NULL, '2022-12-24 11:01:02', '2023-01-18 15:05:38'),
(16, '1.5', 'Test Desc', NULL, '2023-01-18 15:06:22', '2023-01-18 15:06:22'),
(17, '1.6', 'Latest Version', NULL, '2023-08-07 07:06:53', '2023-08-07 07:06:53'),
(18, '1.7', 'DB Update Version', NULL, '2023-12-15 07:06:53', '0000-00-00 00:00:00'),
(19, '1.0', 'Optimized Version', 'UserManual/UserManual.pdf', '2024-04-06 08:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `aqi`
--

CREATE TABLE `aqi` (
  `id` int NOT NULL,
  `parameter` varchar(255) NOT NULL,
  `units` varchar(16) DEFAULT NULL,
  `good` varchar(255) DEFAULT NULL,
  `satisfactory` varchar(255) DEFAULT NULL,
  `moderately` varchar(255) DEFAULT NULL,
  `poor` varchar(255) DEFAULT NULL,
  `veryPoor` varchar(255) DEFAULT NULL,
  `severe` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` int NOT NULL,
  `locationID` int DEFAULT NULL,
  `branchName` varchar(128) DEFAULT NULL,
  `coordinates` varchar(64) DEFAULT NULL,
  `info` text,
  `image` varchar(256) DEFAULT NULL,
  `parentID` int DEFAULT NULL,
  `dispStatus` varchar(64) DEFAULT NULL,
  `dispAqiValue` varchar(64) DEFAULT NULL,
  `dispCategory` varchar(64) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `locationID`, `branchName`, `coordinates`, `info`, `image`, `parentID`, `dispStatus`, `dispAqiValue`, `dispCategory`, `createdAt`, `modifiedAt`) VALUES
(1, 1, 'Alberta', '51.028595205054685, -113.89758300781253', NULL, 'branch/1712221737_holger-link-748973-unsplash-1030x687.jpg', NULL, NULL, '73', NULL, '2023-12-14 04:51:04', '2024-04-06 07:59:14'),
(39, 34, 'fddf', '22.71543464507174, 80.40145518125', NULL, 'branch/1725613239_image (8).png', NULL, NULL, NULL, NULL, '2024-09-06 09:00:39', '2024-09-06 09:00:39'),
(40, 35, 'DDD', '22.350120550064528, 78.73153330625', NULL, 'branch/1725613463_Tegelen.png', NULL, NULL, NULL, NULL, '2024-09-06 09:04:23', '2024-09-06 09:04:23'),
(41, 34, 'Kansas', '39.1897283170301, -96.85196278750001', NULL, 'branch/1725614760_Verstegen.png', NULL, NULL, NULL, NULL, '2024-09-06 09:26:00', '2024-09-06 09:26:00'),
(42, 1, 'Antares_5', '56.47187782847792, -106.67762497044977', NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-09 02:19:25', '2024-09-09 02:19:25');

-- --------------------------------------------------------

--
-- Table structure for table `buildings`
--

CREATE TABLE `buildings` (
  `id` int NOT NULL,
  `locationID` int DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `facilityID` int DEFAULT NULL,
  `buildingName` varchar(128) DEFAULT NULL,
  `coordinates` varchar(64) DEFAULT NULL,
  `info` text,
  `image` varchar(256) DEFAULT NULL,
  `parentID` int DEFAULT NULL,
  `buildingTag` varchar(64) DEFAULT NULL,
  `dispStatus` varchar(64) DEFAULT NULL,
  `dispAqiValue` varchar(64) DEFAULT NULL,
  `dispCategory` varchar(64) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `buildings`
--

INSERT INTO `buildings` (`id`, `locationID`, `branchID`, `facilityID`, `buildingName`, `coordinates`, `info`, `image`, `parentID`, `buildingTag`, `dispStatus`, `dispAqiValue`, `dispCategory`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 1, 'South Pointe Toyota', '56.6682961379394, -115.10525298118591', 'Factory', 'building/1712389922_2020-10-17.jpg', NULL, 'B3', NULL, '60', NULL, '2023-12-14 04:56:08', '2024-04-06 07:52:02'),
(26, 1, 1, 1, 'Canyon Creek Toyota', '56.3927606466472, -114.83416748046875', NULL, 'building/1712390084_IMG_20190912_124840.jpg', NULL, NULL, NULL, NULL, NULL, '2024-04-06 07:54:44', '2024-04-06 07:54:44'),
(27, 1, 1, 1, 'Lexus of Calgary', '56.3927606466472, -114.83416748046875', NULL, 'building/1712390118_2020-03-27.jpg', NULL, NULL, NULL, NULL, NULL, '2024-04-06 07:55:18', '2024-04-06 07:55:18'),
(28, 1, 1, 1, 'Heninger Service Centre', '56.3927606466472, -114.83416748046875', NULL, 'building/1712390147_2022-08-23.jpg', NULL, NULL, NULL, NULL, NULL, '2024-04-06 07:55:47', '2024-04-06 07:55:47'),
(29, 1, 1, 1, 'Stampede Toyota', '56.3927606466472, -114.83416748046875', NULL, 'building/1712390178_2024-01-12.jpg', NULL, NULL, NULL, NULL, NULL, '2024-04-06 07:56:18', '2024-04-06 07:56:18'),
(30, 1, 1, 1, 'Toyota Canada Inc', '56.3927606466472, -114.83416748046875', NULL, 'building/1712390205_thumbnail.jpeg', NULL, NULL, NULL, NULL, NULL, '2024-04-06 07:56:45', '2024-04-06 07:56:45'),
(31, 1, 1, 1, 'Country Hills Toyota', '56.3927606466472, -114.83416748046875', NULL, 'building/1712390258_2016-05-21.jpg', NULL, NULL, NULL, NULL, NULL, '2024-04-06 07:57:38', '2024-04-06 07:57:38'),
(32, 1, 1, 32, 'Gateway Toyota', '53.51514778658471, -113.39221191406253', NULL, 'building/1712390427_2023-11-07.jpg', NULL, NULL, NULL, NULL, NULL, '2024-04-06 08:00:27', '2024-04-06 08:00:27'),
(33, 1, 1, 32, 'Lexus South Pointe', '53.51514778658471, -113.39221191406253', NULL, 'building/1712390468_2024-02-13.jpg', NULL, NULL, NULL, NULL, NULL, '2024-04-06 08:01:08', '2024-04-06 08:01:08'),
(34, 1, 1, 32, 'Toyota on the Trail', '53.51514778658471, -113.39221191406253', NULL, 'building/1712390491_04-07-17 Highlander Shoot-2-8877.jpg', NULL, NULL, NULL, NULL, NULL, '2024-04-06 08:01:31', '2024-04-06 08:01:31'),
(35, 1, 1, 32, 'Sherwood Park Toyota', '53.51514778658471, -113.39221191406253', NULL, 'building/1712390524_uno.JPG', NULL, NULL, NULL, NULL, NULL, '2024-04-06 08:02:04', '2024-04-06 08:02:04'),
(36, 1, 1, 32, 'Toyota West Edmonton Mall', '53.51514778658471, -113.39221191406253', NULL, 'building/1712390555_2022-07-07.png', NULL, NULL, NULL, NULL, NULL, '2024-04-06 08:02:35', '2024-04-06 08:02:35'),
(37, 34, 41, 34, 'Toyota', '39.1897283170301, -96.85196278750001', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-11 14:59:34', '2024-09-11 14:59:34');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `categoryName` varchar(64) DEFAULT NULL,
  `categoryDescription` varchar(256) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `categoryName`, `categoryDescription`, `createdAt`, `modifiedAt`) VALUES
(4, 'CP', 'CP', '2024-01-30 10:11:28', '2024-09-06 09:12:55'),
(5, 'CNP', 'CNP', '2024-01-30 10:11:37', '2024-09-06 09:13:16'),
(6, 'MON', 'MON', '2024-01-30 10:11:47', '2024-09-06 09:13:33');

-- --------------------------------------------------------

--
-- Table structure for table `communication`
--

CREATE TABLE `communication` (
  `id` int NOT NULL,
  `name` text NOT NULL,
  `isWifi` int DEFAULT NULL,
  `isGSM` int DEFAULT NULL,
  `isFTP` int DEFAULT NULL,
  `wifiInfo` json DEFAULT NULL,
  `gsmInfo` json DEFAULT NULL,
  `ftpInfo` json DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `id` int NOT NULL,
  `companyName` varchar(128) DEFAULT NULL,
  `companyCode` varchar(16) DEFAULT NULL COMMENT '2 Characer Index for DB suffix',
  `email` varchar(128) DEFAULT NULL,
  `website` varchar(128) DEFAULT NULL,
  `imageInfo` varchar(2048) DEFAULT NULL,
  `companyInfo` text,
  `contactInfo` text,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`id`, `companyName`, `companyCode`, `email`, `website`, `imageInfo`, `companyInfo`, `contactInfo`, `createdAt`, `updatedAt`) VALUES
(1, 'GrandCo', 'GC', 'admin@grandco.ca', 'https://grandco.ca', '{\"logo\":\"company/KW/image.png\", \"loginPageImage\":\"company/KW/image.png\", \"companyName\": \"GrandCo\"}', NULL, NULL, '2023-12-14 03:47:49', '2024-09-12 09:19:41'),
(2, 'Dabadu', 'KW', 'admin@dabadu.com', 'https://www.dabadu.ai/', '{\"logo\":\"company/KW/logo.svg\", \"loginPageImage\":\"company/KW/image.png\", \"companyName\": \"Dabadu\"}', NULL, NULL, '2023-12-14 03:48:36', '2024-09-12 09:20:04');

-- --------------------------------------------------------

--
-- Table structure for table `devices`
--

CREATE TABLE `devices` (
  `id` int UNSIGNED NOT NULL,
  `locationID` int UNSIGNED DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `facilityID` int DEFAULT NULL,
  `buildingID` int DEFAULT NULL,
  `floorID` int DEFAULT NULL,
  `coordinates` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zoneID` int DEFAULT NULL,
  `parentID` int DEFAULT NULL,
  `image` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deviceName` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deviceAuthID` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoryID` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `deviceCategory` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `connStatus` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `firmwareVersion` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `macAddress` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serialNumber` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deviceTag` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nonPollingPriority` int DEFAULT NULL,
  `pollingPriority` int DEFAULT NULL,
  `dataPushUrl` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `firmwarePushUrl` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `binFileName` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deviceMode` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hardwareModelVersion` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `disconnectionStatus` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notificationShow` int DEFAULT NULL,
  `modifiedBy` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modifiedStatus` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `connectionInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `disconnectedOnGrid` int NOT NULL DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `devices`
--

INSERT INTO `devices` (`id`, `locationID`, `branchID`, `facilityID`, `buildingID`, `floorID`, `coordinates`, `zoneID`, `parentID`, `image`, `deviceName`, `deviceAuthID`, `categoryID`, `deviceCategory`, `connStatus`, `firmwareVersion`, `macAddress`, `serialNumber`, `deviceTag`, `nonPollingPriority`, `pollingPriority`, `dataPushUrl`, `firmwarePushUrl`, `binFileName`, `deviceMode`, `hardwareModelVersion`, `disconnectionStatus`, `notificationShow`, `modifiedBy`, `modifiedStatus`, `connectionInfo`, `disconnectedOnGrid`, `createdAt`, `modifiedAt`) VALUES
(102, 1, 1, 1, 1, 2, NULL, 4, NULL, NULL, 'Lane/3000 Dev 2', NULL, 'IAQ', 'IAQ', '', '1.1', '94:B5:55:A5:35:84', NULL, 'Lane/3000 Dev 2', 35, 30, 'http://127.0.0.1:8000/api/device/pushData', NULL, NULL, 'enabled', '1.1', NULL, NULL, NULL, NULL, NULL, 1, '2024-04-06 08:05:37', '2024-04-06 08:05:37'),
(103, 1, 1, 1, 1, 2, NULL, 4, NULL, NULL, 'Lane/3000 Dev 3', NULL, 'IAQ', 'IAQ', '', '1.1', '94:B5:55:A5:35:84', NULL, 'Lane/3000 Dev 3', 35, 30, 'http://127.0.0.1:8000/api/device/pushData', NULL, NULL, 'enabled', '1.1', NULL, NULL, NULL, NULL, NULL, 0, '2024-04-06 08:06:10', '2024-04-06 08:06:10'),
(104, 1, 1, 1, 26, 28, NULL, 31, NULL, NULL, 'L3000-18967028', 'L3000_28', '4', 'CP', '', '1.1', 'L3000-18967028', 'R7320365LT001064', 'L3000-18967028', 35, 30, 'http://127.0.0.1:8000/api/device/pushData', NULL, NULL, 'enabled', '1.1', NULL, NULL, NULL, NULL, NULL, 0, '2024-04-06 09:03:40', '2024-09-06 09:14:28'),
(105, 1, 1, 1, 26, 28, NULL, 31, NULL, NULL, 'Lane/3000 Dev 6', 'L3000_6', '4', 'CP', '', NULL, '94:B5:55:A5:35:84', NULL, 'Lane/3000 Dev 6', 35, 30, 'http://127.0.0.1:8000/api/device/pushData', NULL, NULL, 'enabled', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2024-04-06 09:04:20', '2024-09-06 09:14:37'),
(106, 1, 1, 1, 26, 29, NULL, 32, NULL, NULL, 'Lane/3000 Dev 8', NULL, '4', 'CP', '', '1.1', '94:B5:55:A5:35:84', NULL, 'Lane/3000 Dev 8', 35, 30, 'http://127.0.0.1:8000/api/device/pushData', NULL, NULL, 'enabled', '1.1', NULL, NULL, NULL, NULL, NULL, 1, '2024-04-06 09:07:13', '2024-09-06 09:14:40');

-- --------------------------------------------------------

--
-- Table structure for table `emailTextInfo`
--

CREATE TABLE `emailTextInfo` (
  `id` int NOT NULL,
  `templateID` varchar(32) DEFAULT NULL,
  `subject` varchar(128) DEFAULT NULL,
  `body` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `facilities`
--

CREATE TABLE `facilities` (
  `id` int NOT NULL,
  `locationID` int DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `facilityName` varchar(128) DEFAULT NULL,
  `coordinates` varchar(64) DEFAULT NULL,
  `info` text,
  `image` varchar(256) DEFAULT NULL,
  `parentID` int DEFAULT NULL,
  `dispStatus` varchar(64) DEFAULT NULL,
  `dispAqiValue` varchar(64) DEFAULT NULL,
  `dispCategory` varchar(64) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `facilities`
--

INSERT INTO `facilities` (`id`, `locationID`, `branchID`, `facilityName`, `coordinates`, `info`, `image`, `parentID`, `dispStatus`, `dispAqiValue`, `dispCategory`, `createdAt`, `modifiedAt`) VALUES
(1, 1, 1, 'Calgary', '56.3927606466472, -114.83416748046875', NULL, NULL, NULL, NULL, '73', NULL, '2023-12-14 04:52:52', '2024-04-06 07:59:20'),
(32, 1, 1, 'Edmonton', '53.51514778658471, -113.39221191406253', NULL, NULL, NULL, NULL, NULL, NULL, '2024-04-06 07:59:50', '2024-04-06 07:59:50'),
(33, 34, 39, 'fdfd', '22.755965293995892, 80.434414165625', NULL, 'facility/1725613257_image (7).png', NULL, NULL, NULL, NULL, '2024-09-06 09:00:57', '2024-09-06 09:00:57'),
(34, 34, 41, 'ontario', '39.1897283170301, -96.85196278750001', NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-11 14:59:15', '2024-09-11 14:59:15');

-- --------------------------------------------------------

--
-- Table structure for table `floors`
--

CREATE TABLE `floors` (
  `id` int NOT NULL,
  `locationID` int DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `facilityID` int DEFAULT NULL,
  `buildingID` int DEFAULT NULL,
  `floorName` varchar(128) DEFAULT NULL,
  `coordinates` varchar(64) DEFAULT NULL,
  `info` text,
  `image` varchar(256) DEFAULT NULL,
  `parentID` int DEFAULT NULL,
  `dispStatus` varchar(64) DEFAULT NULL,
  `dispAqiValue` varchar(64) DEFAULT NULL,
  `dispCategory` varchar(64) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `floors`
--

INSERT INTO `floors` (`id`, `locationID`, `branchID`, `facilityID`, `buildingID`, `floorName`, `coordinates`, `info`, `image`, `parentID`, `dispStatus`, `dispAqiValue`, `dispCategory`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 1, 1, 'Shop Floor', '0', 'Customers/001/Buildings/Floors/0.png', 'floor/1712395425_2023-11-07.jpg', NULL, NULL, '30', NULL, '2023-12-14 04:58:49', '2024-04-06 09:23:45'),
(2, 1, 1, 1, 1, 'First Floor1', '1', 'Customers/001/Buildings/Floors/1.png', 'floor/1710928534_RoomSketcher-High-Quality-3D-Floor-Plans.jpg', NULL, NULL, '52', NULL, '2023-12-14 04:58:49', '2024-03-21 12:57:25'),
(3, 1, 1, 1, 1, 'Ground Floor', '3', 'Customers/001/Buildings/Floors/3.png', 'floor/1710131101_download123.png', NULL, NULL, '60', NULL, '2023-12-14 04:58:49', '2024-03-11 04:25:01'),
(28, 1, 1, 1, 26, 'First Floor', 'null', NULL, 'floor/1725849223_75310.jpg', NULL, NULL, NULL, NULL, '2024-04-06 08:03:10', '2024-09-09 02:33:43'),
(29, 1, 1, 1, 26, 'Ground Floor', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-04-06 09:04:51', '2024-04-06 09:04:51'),
(30, 34, 41, 34, 37, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-11 14:59:43', '2024-09-11 14:59:43');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int NOT NULL,
  `locationName` varchar(128) DEFAULT NULL,
  `coordinates` varchar(64) DEFAULT NULL,
  `info` text,
  `image` varchar(256) DEFAULT NULL,
  `parentID` int DEFAULT NULL,
  `dispStatus` varchar(64) DEFAULT NULL,
  `dispAqiValue` varchar(64) DEFAULT NULL,
  `dispCategory` varchar(64) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `locationName`, `coordinates`, `info`, `image`, `parentID`, `dispStatus`, `dispAqiValue`, `dispCategory`, `createdAt`, `modifiedAt`) VALUES
(1, 'Canada', '56.47187782847792, -106.67762497044977', NULL, NULL, NULL, NULL, '73', NULL, '2023-12-14 04:50:12', '2024-04-06 07:33:58'),
(34, 'Tegelen', NULL, NULL, 'location/1726066091_75310.jpg', NULL, NULL, NULL, NULL, '2024-09-06 05:37:56', '2024-09-11 14:48:11'),
(35, 'XX', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-06 09:03:38', '2024-09-06 09:03:38');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sensorOutputTypes`
--

CREATE TABLE `sensorOutputTypes` (
  `id` int NOT NULL,
  `sensorOutputType` varchar(255) NOT NULL,
  `otherSensorInfo` json DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sensorOutputTypes`
--

INSERT INTO `sensorOutputTypes` (`id`, `sensorOutputType`, `otherSensorInfo`, `createdAt`, `updatedAt`) VALUES
(2, 'Analog', NULL, '2024-01-24 15:06:35', '2024-02-29 09:06:05'),
(3, 'Digital', NULL, '2024-01-24 15:07:21', '2024-02-29 09:36:41'),
(4, 'Inbuilt', NULL, '2024-01-25 11:38:36', '2024-01-25 11:38:36'),
(6, 'Modbus', NULL, '2024-01-31 09:31:56', '2024-02-29 09:36:47');

-- --------------------------------------------------------

--
-- Table structure for table `sensors`
--

CREATE TABLE `sensors` (
  `id` int NOT NULL,
  `locationID` int DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `facilityID` int DEFAULT NULL,
  `buildingID` int DEFAULT NULL,
  `floorID` int DEFAULT NULL,
  `zoneID` int DEFAULT NULL,
  `deviceID` int DEFAULT NULL,
  `parentID` int DEFAULT NULL,
  `deviceCategory` varchar(64) DEFAULT NULL,
  `sensorName` varchar(128) DEFAULT NULL,
  `sensorTag` varchar(128) DEFAULT NULL,
  `sensorCategory` varchar(64) DEFAULT NULL,
  `slotID` text,
  `defaultValue` decimal(8,4) DEFAULT NULL,
  `alarmType` varchar(64) DEFAULT NULL COMMENT 'Latch,UnLatch',
  `bumpTest` tinyint(1) DEFAULT NULL,
  `calibrationTest` tinyint(1) DEFAULT NULL,
  `isStel` tinyint(1) DEFAULT NULL,
  `isTwa` tinyint(1) DEFAULT NULL,
  `isAQI` tinyint(1) DEFAULT NULL,
  `bumpInfo` text,
  `calibrationInfo` text,
  `scaleInfo` text,
  `stelInfo` text,
  `twaInfo` text,
  `modBusInfo` text,
  `criticalAlertInfo` text,
  `warningAlertInfo` text,
  `outOfRangeAlertInfo` text,
  `nMin` decimal(11,3) DEFAULT NULL,
  `nMax` decimal(11,3) DEFAULT NULL,
  `digitalAlertInfo` text,
  `sensorOutput` varchar(64) DEFAULT NULL,
  `pollingIntervalType` enum('0','1') NOT NULL DEFAULT '0',
  `units` varchar(64) DEFAULT NULL,
  `sensorStatus` int DEFAULT '1',
  `notificationStatus` int DEFAULT NULL,
  `manufacturer` text,
  `partID` text,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sensors`
--

INSERT INTO `sensors` (`id`, `locationID`, `branchID`, `facilityID`, `buildingID`, `floorID`, `zoneID`, `deviceID`, `parentID`, `deviceCategory`, `sensorName`, `sensorTag`, `sensorCategory`, `slotID`, `defaultValue`, `alarmType`, `bumpTest`, `calibrationTest`, `isStel`, `isTwa`, `isAQI`, `bumpInfo`, `calibrationInfo`, `scaleInfo`, `stelInfo`, `twaInfo`, `modBusInfo`, `criticalAlertInfo`, `warningAlertInfo`, `outOfRangeAlertInfo`, `nMin`, `nMax`, `digitalAlertInfo`, `sensorOutput`, `pollingIntervalType`, `units`, `sensorStatus`, `notificationStatus`, `manufacturer`, `partID`, `createdAt`, `modifiedAt`) VALUES
(1, 1, 1, 1, 1, 1, 2, 2, NULL, 'AQMi', 'Noise Meter', 'CNC-Noise', NULL, NULL, 10.2220, 'UnLatch', NULL, NULL, 1, 1, 0, NULL, NULL, '{\"minR\":\"4\",\"maxR\":\"20\",\"minRS\":\"30\",\"maxRS\":\"120\"}', '{\"stelLimit\":\"100\",\"stelDuration\":\"15\",\"stelAlert\":\"Noise STEL Alert\"}', '{\"shift1\":{\"twaLimit\":\"85\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"Noise TWA Alert\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"110\",\"cLTxt\":null,\"cHTxt\":\"Noise Meter Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"-3\",\"wMax\":\"85\",\"wLTxt\":null,\"wHTxt\":\"Noise Meter Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"29\",\"oMax\":\"121\",\"oLTxt\":\"Noise Meter Out Of Range Low Alarm\",\"oHTxt\":\"Noise Meter Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', 'db', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(2, 1, 1, 1, 1, 1, 1, 4, NULL, 'AQMi', 'Noise Meter', 'Welding-Noise', NULL, NULL, 10.2220, 'UnLatch', NULL, NULL, 1, 1, 0, NULL, NULL, '{\"minR\":\"4\",\"maxR\":\"20\",\"minRS\":\"30\",\"maxRS\":\"120\"}', '{\"stelLimit\":\"100\",\"stelDuration\":\"15\",\"stelAlert\":\"Noise STEL Alert\"}', '{\"shift1\":{\"twaLimit\":\"85\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"Noise TWA Alert\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"110\",\"cLTxt\":null,\"cHTxt\":\"Noise Meter Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"-3\",\"wMax\":\"85\",\"wLTxt\":null,\"wHTxt\":\"Noise Meter Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"29\",\"oMax\":\"121\",\"oLTxt\":\"Noise Meter Out Of Range Low Alarm\",\"oHTxt\":\"Noise Meter Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', 'db', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(3, 1, 1, 1, 1, 1, 1, 3, NULL, 'AQI', 'PM2.5', 'PM2.5-IAQI', NULL, NULL, 20.0000, 'UnLatch', 0, NULL, 1, 1, 1, NULL, NULL, '{\"minR\":\"0\",\"minRS\":\"0\",\"maxR\":\"1000\",\"maxRS\":\"1000\"}', '{\"stelLimit\":\"90\",\"stelDuration\":\"15\",\"stelAlert\":\"PM2.5 STEL Alert\"}', '{\"shift1\":{\"twaShiftId\":\"shift1\",\"twaLimit\":\"60\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"PM2.5 TWA Alert\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"250\",\"cLTxt\":null,\"cHTxt\":\"PM2.5 Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"120\",\"wLTxt\":null,\"wHTxt\":\"PM2.5 Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"1001\",\"oLTxt\":\"PM2.5 Out Of Range Low Alarm\",\"oHTxt\":\"PM2.5 Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', 'µg/m3', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(4, 1, 1, 1, 1, 1, 1, 3, NULL, 'AQI', 'PM10', 'PM10-IAQI', NULL, NULL, 42.0000, 'UnLatch', 0, NULL, 1, 1, 1, NULL, NULL, '{\"minR\":\"0\",\"minRS\":\"0\",\"maxR\":\"1000\",\"maxRS\":\"1000\"}', '{\"stelLimit\":\"250\",\"stelDuration\":\"15\",\"stelAlert\":\"PM10 STEL Alert\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"100\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"PM10 TWA Alert\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"430\",\"cLTxt\":null,\"cHTxt\":\"PM10 Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"350\",\"wLTxt\":null,\"wHTxt\":\"PM10 Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"1001\",\"oLTxt\":\"PM10 Out Of Range Low Alarm\",\"oHTxt\":\"PM10 Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', 'µg/m3', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(5, 1, 1, 1, 1, 1, 2, 5, NULL, 'AQMi', 'Temperature', 'Temp-PT', NULL, NULL, 12.0000, 'UnLatch', NULL, NULL, 0, 0, 0, NULL, NULL, '{\"minR\":\"4\",\"maxR\":\"20\",\"minRS\":\"-5\",\"maxRS\":\"55\"}', '{\"stelLimit\":\"0\",\"stelDuration\":null,\"stelAlert\":null}', '[]', '[]', '{\"cAT\":\"Both\",\"cMin\":\"2\",\"cMax\":\"45\",\"cLTxt\":\"Temperature Critical Low Alarm\",\"cHTxt\":\"Temperature Critical High Alarm\"}', '{\"wAT\":\"Both\",\"wMin\":\"5\",\"wMax\":\"40\",\"wLTxt\":\"Temperature Warning Low Alarm\",\"wHTxt\":\"Temperature Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-6\",\"oMax\":\"56\",\"oLTxt\":\"Temperature Out Of Range Low Alarm\",\"oHTxt\":\"Temperature Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', '°C', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(6, 1, 1, 1, 1, 1, 2, 5, NULL, 'AQMi', 'Humidity', 'Humid-PT', NULL, NULL, 12.0000, 'UnLatch', NULL, NULL, 0, 0, 0, NULL, NULL, '{\"minR\":\"4\",\"maxR\":\"20\",\"minRS\":\"0\",\"maxRS\":\"100\"}', '{\"stelLimit\":\"0\",\"stelDuration\":null,\"stelAlert\":null}', '[]', '[]', '{\"cAT\":\"High\",\"cMin\":\"35\",\"cMax\":\"95\",\"cLTxt\":null,\"cHTxt\":\"Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"40\",\"wMax\":\"90\",\"wLTxt\":null,\"wHTxt\":\"Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"101\",\"oLTxt\":\"Humidity Out Of Range Low Alarm\",\"oHTxt\":\"Humidity Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', '%', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(7, 1, 1, 1, 1, 1, 2, 5, NULL, 'IAQ', 'Flammable Gas', 'Flammable', NULL, 'A7', 5.5920, 'Latch', 0, NULL, 0, 0, 0, NULL, NULL, '{\"minR\":\"3.98\",\"minRS\":\"0\",\"maxR\":\"20\",\"maxRS\":\"100\"}', '{\"stelLimit\":\"0\",\"stelDuration\":null,\"stelAlert\":null}', '[]', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"60\",\"cLTxt\":null,\"cHTxt\":\"Flammable Gas Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"40\",\"wLTxt\":null,\"wHTxt\":\"Flammable Gas Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"0\",\"oMax\":\"101\",\"oLTxt\":null,\"oHTxt\":\"Flammable Gas Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', '%', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(8, 1, 1, 1, 1, 1, 2, 6, NULL, 'IAQ', 'PM2.5', 'PM2.5-PCEN', NULL, 'A8', 4.9600, 'UnLatch', 0, NULL, 1, 1, 1, NULL, NULL, '{\"minR\":\"4\",\"minRS\":\"0\",\"maxR\":\"20\",\"maxRS\":\"1000\"}', '{\"stelLimit\":\"90\",\"stelDuration\":\"15\",\"stelAlert\":\"PM2.5 STEL Alert\"}', '{\"shift1\":{\"twaShiftId\":\"Shift1\",\"twaLimit\":\"60\",\"twaDuration\":480,\"twaStartTime\":\"14:30\",\"twaAlert\":\"Pm2.5 TWA Alert\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"20\",\"cMax\":\"250\",\"cLTxt\":null,\"cHTxt\":\"PM2.5 Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"50\",\"wMax\":\"122\",\"wLTxt\":null,\"wHTxt\":\"PM2.5 Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"1001\",\"oLTxt\":\"PM2.5 Out Of Range Low Alarm\",\"oHTxt\":\"PM2.5 Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', 'µg/m3', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(9, 1, 1, 1, 1, 1, 2, 6, NULL, 'AQMi', 'PM10', 'PM10-PCEN', NULL, NULL, 6.8000, 'UnLatch', NULL, NULL, 1, 1, 1, NULL, NULL, '{\"minR\":\"4\",\"maxR\":\"20\",\"minRS\":\"0\",\"maxRS\":\"1000\"}', '{\"stelLimit\":\"250\",\"stelDuration\":\"15\",\"stelAlert\":\"PM10 STEL Alert\"}', '{\"shift1\":{\"twaLimit\":\"100\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"PM10 TWA Alert\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"430\",\"cLTxt\":null,\"cHTxt\":\"PM10 Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"350\",\"wLTxt\":null,\"wHTxt\":\"PM10 Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"1001\",\"oLTxt\":\"PM10 Out Of Range Low Alarm\",\"oHTxt\":\"PM10 Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', 'µg/m3', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(11, 1, 1, 1, 1, 1, 2, 7, NULL, 'AQMi', 'PM10', 'PM10-PCO', NULL, NULL, 6.8000, 'UnLatch', NULL, NULL, 1, 1, 1, NULL, NULL, '{\"minR\":\"4\",\"maxR\":\"20\",\"minRS\":\"0\",\"maxRS\":\"1000\"}', '{\"stelLimit\":\"250\",\"stelDuration\":\"15\",\"stelAlert\":\"PM10 STEL Alert\"}', '{\"shift1\":{\"twaLimit\":\"100\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"PM10 TWA Alert\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"430\",\"cLTxt\":null,\"cHTxt\":\"PM10 Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"350\",\"wLTxt\":null,\"wHTxt\":\"PM10 Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"1001\",\"oLTxt\":\"PM10 Out Of Range Low Alarm\",\"oHTxt\":\"PM10 Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', 'µg/m3', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(12, 1, 1, 1, 1, 1, 2, 8, NULL, 'AQMi', 'PM2.5', 'PM2.5-PCEX', NULL, NULL, 4.9600, 'UnLatch', NULL, NULL, 1, 1, 1, NULL, NULL, '{\"minR\":\"4\",\"maxR\":\"20\",\"minRS\":\"0\",\"maxRS\":\"1000\"}', '{\"stelLimit\":\"90\",\"stelDuration\":\"15\",\"stelAlert\":\"PM2.5 STEL Alert\"}', '{\"shift1\":{\"twaLimit\":\"60\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"PM2.5 TWA Alert\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"250\",\"cLTxt\":null,\"cHTxt\":\"PM2.5 Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"120\",\"wLTxt\":null,\"wHTxt\":\"PM2.5 Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"1001\",\"oLTxt\":\"PM2.5 Out Of Range Low Alarm\",\"oHTxt\":\"PM2.5 Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', 'µg/m3', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(13, 1, 1, 1, 1, 1, 2, 8, NULL, 'AQMi', 'PM10', 'PM10-PCEX', NULL, NULL, 6.8000, 'UnLatch', NULL, NULL, 1, 1, 1, NULL, NULL, '{\"minR\":\"4\",\"maxR\":\"20\",\"minRS\":\"0\",\"maxRS\":\"1000\"}', '{\"stelLimit\":\"250\",\"stelDuration\":\"15\",\"stelAlert\":\"PM10 STEL Alert\"}', '{\"shift1\":{\"twaLimit\":\"100\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"PM10 TWA Alert\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"430\",\"cLTxt\":null,\"cHTxt\":\"PM10 Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"350\",\"wLTxt\":null,\"wHTxt\":\"PM10 Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"1001\",\"oLTxt\":\"PM10 Out Of Range Low Alarm\",\"oHTxt\":\"PM10 Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', 'µg/m3', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(14, 1, 1, 1, 1, 1, 2, 8, NULL, 'AQMi', 'Temperature', 'Temp-PCEX', NULL, NULL, 12.0000, 'UnLatch', NULL, NULL, 0, 0, 0, NULL, NULL, '{\"minR\":\"4\",\"maxR\":\"20\",\"minRS\":\"-5\",\"maxRS\":\"55\"}', '{\"stelLimit\":\"0\",\"stelDuration\":null,\"stelAlert\":null}', '[]', '[]', '{\"cAT\":\"Both\",\"cMin\":\"2\",\"cMax\":\"45\",\"cLTxt\":\"Temperature Critical Low Alarm\",\"cHTxt\":\"Temperature Critical High Alarm\"}', '{\"wAT\":\"Both\",\"wMin\":\"5\",\"wMax\":\"40\",\"wLTxt\":\"Temperature Warning Low Alarm\",\"wHTxt\":\"Temperature Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-6\",\"oMax\":\"56\",\"oLTxt\":\"Temperature Out Of Range Low Alarm\",\"oHTxt\":\"Temperature Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', '°C', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(15, 1, 1, 1, 1, 1, 2, 8, NULL, 'AQMi', 'Humidity', 'Humid-PCEX', NULL, NULL, 12.0000, 'UnLatch', NULL, NULL, 0, 0, 0, NULL, NULL, '{\"minR\":\"4\",\"maxR\":\"20\",\"minRS\":\"0\",\"maxRS\":\"100\"}', '{\"stelLimit\":\"0\",\"stelDuration\":null,\"stelAlert\":null}', '[]', '[]', '{\"cAT\":\"Both\",\"cMin\":\"35\",\"cMax\":\"85\",\"cLTxt\":\"Critical Low Alarm\",\"cHTxt\":\"Critical High Alarm\"}', '{\"wAT\":\"Both\",\"wMin\":\"40\",\"wMax\":\"80\",\"wLTxt\":\"Warning Low Alarm\",\"wHTxt\":\"Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"101\",\"oLTxt\":\"Humidity Out Of Range Low Alarm\",\"oHTxt\":\"Humidity Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', '%', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(16, 1, 1, 1, 1, 1, 3, 9, NULL, 'AQMi', 'Temperature', 'Temp-FHA', NULL, NULL, 12.0000, 'UnLatch', NULL, NULL, 0, 0, 0, NULL, NULL, '{\"minR\":\"4\",\"maxR\":\"20\",\"minRS\":\"-5\",\"maxRS\":\"55\"}', '{\"stelLimit\":\"0\",\"stelDuration\":null,\"stelAlert\":null}', '[]', '[]', '{\"cAT\":\"Both\",\"cMin\":\"2\",\"cMax\":\"45\",\"cLTxt\":\"Temperature Critical Low Alarm\",\"cHTxt\":\"Temperature Critical High Alarm\"}', '{\"wAT\":\"Both\",\"wMin\":\"5\",\"wMax\":\"40\",\"wLTxt\":\"Temperature Warning Low Alarm\",\"wHTxt\":\"Temperature Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-6\",\"oMax\":\"56\",\"oLTxt\":\"Temperature Out Of Range Low Alarm\",\"oHTxt\":\"Temperature Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', '°C', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(17, 1, 1, 1, 1, 1, 3, 9, NULL, 'AQMi', 'Humidity', 'Humid-FHA', NULL, NULL, 12.0000, 'UnLatch', NULL, NULL, 0, 0, 0, NULL, NULL, '{\"minR\":\"4\",\"maxR\":\"20\",\"minRS\":\"0\",\"maxRS\":\"100\"}', '{\"stelLimit\":\"0\",\"stelDuration\":null,\"stelAlert\":null}', '[]', '[]', '{\"cAT\":\"High\",\"cMin\":\"5\",\"cMax\":\"95\",\"cLTxt\":null,\"cHTxt\":\"Humidity Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"10\",\"wMax\":\"90\",\"wLTxt\":null,\"wHTxt\":\"Humidity Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"101\",\"oLTxt\":\"Humidity Out Of Range Low Alarm\",\"oHTxt\":\"Humidity Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', '%', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(20, 1, 1, 1, 1, 1, 3, 10, NULL, 'AQMi', 'TVOC-IAQ', 'TVOC-BSCA', NULL, NULL, 900.0000, 'UnLatch', NULL, NULL, 0, 0, 0, NULL, NULL, '{\"minR\":\"0\",\"maxR\":\"45000\",\"minRS\":\"0\",\"maxRS\":\"45000\"}', '{\"stelLimit\":\"0\",\"stelDuration\":null,\"stelAlert\":null}', '[]', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"3600\",\"cLTxt\":null,\"cHTxt\":\"TVOC-IAQ Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"1800\",\"wLTxt\":null,\"wHTxt\":\"TVOC-IAQ Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"45001\",\"oLTxt\":\"TVOC-IAQ Out Of Range Low Alarm\",\"oHTxt\":\"TVOC-IAQ Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Modbus', '0', 'µg/m3', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(21, 1, 1, 1, 1, 1, 3, 10, NULL, 'AQMi', 'CO2-IAQ', 'CO2-BSCA', NULL, NULL, 2500.0000, 'UnLatch', NULL, NULL, 1, 1, 0, NULL, NULL, '{\"minR\":\"0\",\"maxR\":\"5000\",\"minRS\":\"0\",\"maxRS\":\"5000\"}', '{\"stelLimit\":\"30000\",\"stelDuration\":\"15\",\"stelAlert\":\"CO2 STEL Alert\"}', '{\"shift1\":{\"twaLimit\":\"5000\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"CO2 TWA Alert\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"10000\",\"cLTxt\":null,\"cHTxt\":\"CO2-IAQ Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"5000\",\"wLTxt\":null,\"wHTxt\":\"CO2-IAQ Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"5001\",\"oLTxt\":\"CO2-IAQ Out Of Range Low Alarm\",\"oHTxt\":\"CO2-IAQ Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Modbus', '0', 'ppm', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(22, 1, 1, 1, 1, 1, 3, 10, NULL, 'AQMi', 'PM2.5-IAQ', 'PM2.5-BSCA', NULL, NULL, 60.0000, 'UnLatch', NULL, NULL, 1, 1, 0, NULL, NULL, '{\"minR\":\"0\",\"maxR\":\"1000\",\"minRS\":\"0\",\"maxRS\":\"1000\"}', '{\"stelLimit\":\"90\",\"stelDuration\":\"15\",\"stelAlert\":\"PM2.5 STEL Alert\"}', '{\"shift1\":{\"twaLimit\":\"60\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"PM2.5 TWA Alert\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"250\",\"cLTxt\":null,\"cHTxt\":\"PM2.5-IAQ Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"120\",\"wLTxt\":null,\"wHTxt\":\"PM2.5-IAQ Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"1001\",\"oLTxt\":\"PM2.5-IAQ Out Of Range Low Alarm\",\"oHTxt\":\"PM2.5-IAQ Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Modbus', '0', 'µg/m3', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(23, 1, 1, 1, 1, 1, 3, 10, NULL, 'AQMi', 'PM10-IAQ', 'PM10-BSCA', NULL, NULL, 175.0000, 'UnLatch', NULL, NULL, 1, 1, 0, NULL, NULL, '{\"minR\":\"0\",\"maxR\":\"1000\",\"minRS\":\"0\",\"maxRS\":\"1000\"}', '{\"stelLimit\":\"250\",\"stelDuration\":\"15\",\"stelAlert\":\"PM10 STEL Alert\"}', '{\"shift1\":{\"twaLimit\":\"100\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"PM10 TWA Alert\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"430\",\"cLTxt\":null,\"cHTxt\":\"PM10-IAQ Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"350\",\"wLTxt\":null,\"wHTxt\":\"PM10-IAQ Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"1001\",\"oLTxt\":\"PM10-IAQ Out Of Range Low Alarm\",\"oHTxt\":\"PM10-IAQ Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Modbus', '0', 'µg/m3', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(24, 1, 1, 1, 1, 2, 4, 11, NULL, 'IAQ', 'Temperature-IAQ', 'Temp-FO', NULL, 'A1', 410.0000, 'Latch', 0, NULL, 0, 0, 0, NULL, NULL, '{\"minR\":\"-100\",\"minRS\":\"-10\",\"maxR\":\"700\",\"maxRS\":\"70\"}', '{\"stelLimit\":\"0\",\"stelDuration\":null,\"stelAlert\":null}', '[]', '{\"slaveID\":\"1\",\"register\":\"1\",\"bitLength\":\"16 Bit\",\"registerType\":\"Holding Register\",\"conversionType\":\"Hex\"}', '{\"cAT\":\"Both\",\"cMin\":\"2\",\"cMax\":\"50\",\"cLTxt\":\"Temperature-IAQ Critical Low Alarm\",\"cHTxt\":\"Temperature-IAQ Critical High Alarm\"}', '{\"wAT\":\"Both\",\"wMin\":\"5\",\"wMax\":\"40\",\"wLTxt\":\"Temperature-IAQ Warning Low Alarm\",\"wHTxt\":\"Temperature-IAQ Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-11\",\"oMax\":\"71\",\"oLTxt\":\"Temperature-IAQ Out Of Range Low Alarm\",\"oHTxt\":\"Temperature-IAQ Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Modbus', '0', '°C', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(25, 1, 1, 1, 1, 2, 4, 11, NULL, 'IAQ', 'Humidity-IAQ', 'Humid-FO', NULL, 'A2', 50.0000, 'Latch', 0, NULL, 0, 0, 0, NULL, NULL, '{\"minR\":\"0\",\"minRS\":\"0\",\"maxR\":\"100\",\"maxRS\":\"100\"}', '{\"stelLimit\":\"0\",\"stelDuration\":null,\"stelAlert\":null}', '[]', '{\"slaveID\":\"1\",\"register\":\"1\",\"bitLength\":\"16 Bit\",\"registerType\":\"Holding Register\",\"conversionType\":\"Integer\"}', '{\"cAT\":\"High\",\"cMin\":\"5\",\"cMax\":\"95\",\"cLTxt\":null,\"cHTxt\":\"Humidity-IAQ Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"10\",\"wMax\":\"90\",\"wLTxt\":null,\"wHTxt\":\"Humidity-IAQ Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"101\",\"oLTxt\":\"Humidity-IAQ Out Of Range Low Alarm\",\"oHTxt\":\"Humidity-IAQ Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Modbus', '0', '%', 0, 0, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(26, 1, 1, 1, 1, 2, 4, 11, NULL, 'IAQ', 'TVOC-IAQ', 'TVOC-FO', NULL, 'A0', 900.0000, 'UnLatch', 0, NULL, 0, 0, 0, NULL, NULL, '{\"minR\":\"0\",\"minRS\":\"0\",\"maxR\":\"45000\",\"maxRS\":\"45000\"}', '{\"stelLimit\":\"0\",\"stelDuration\":null,\"stelAlert\":null}', '[]', '{\"slaveID\":\"1\",\"register\":\"1\",\"bitLength\":\"16 Bit\",\"registerType\":\"Holding Register\",\"conversionType\":\"Double\"}', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"3600\",\"cLTxt\":null,\"cHTxt\":\"TVOC-IAQ Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"1800\",\"wLTxt\":null,\"wHTxt\":\"TVOC-IAQ Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"45001\",\"oLTxt\":\"TVOC-IAQ Out Of Range Low Alarm\",\"oHTxt\":\"TVOC-IAQ Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Modbus', '0', 'µg/m3', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(27, 1, 1, 1, 1, 2, 4, 11, NULL, 'IAQ', 'CO2-IAQ', 'CO2-FO', NULL, NULL, 2500.0000, 'UnLatch', 0, NULL, 1, 1, 0, NULL, NULL, '{\"minR\":\"0\",\"minRS\":\"0\",\"maxR\":\"5000\",\"maxRS\":\"5000\"}', '{\"stelLimit\":\"30000\",\"stelDuration\":\"15\",\"stelAlert\":\"CO2 STEL Alert\"}', '{\"shift1\":{\"twaShiftId\":\"Shift\",\"twaLimit\":\"5000\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"CO2 TWA Alert\"}}', '{\"slaveID\":\"2\",\"register\":\"1\",\"bitLength\":\"16 Bit\",\"registerType\":\"Discreate Input\",\"conversionType\":\"Integer\"}', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"5000\",\"cLTxt\":null,\"cHTxt\":\"CO2-IAQ Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"5000\",\"wLTxt\":null,\"wHTxt\":\"CO2-IAQ Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"0\",\"oMax\":\"5000\",\"oLTxt\":\"CO2-IAQ Out Of Range Low Alarm\",\"oHTxt\":\"CO2-IAQ Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Modbus', '0', 'ppm', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(29, 1, 1, 1, 1, 2, 4, 11, NULL, 'IAQ', 'PM10-IAQ', 'PM10-FO', NULL, NULL, 175.0000, 'UnLatch', 0, NULL, 1, 1, 0, NULL, NULL, '{\"minR\":\"0\",\"minRS\":\"0\",\"maxR\":\"1000\",\"maxRS\":\"1000\"}', '{\"stelLimit\":\"250\",\"stelDuration\":\"15\",\"stelAlert\":\"PM10 STEL Alert\"}', '{\"shift1\":{\"twaShiftId\":\"Shift\",\"twaLimit\":\"100\",\"twaDuration\":\"480\",\"twaStartTime\":\"11:00\",\"twaAlert\":\"PM10 TWA Alert\"}}', '{\"slaveID\":\"1\",\"register\":\"1\",\"bitLength\":\"16 Bit\",\"registerType\":\"Holding Register\",\"conversionType\":\"Integer\"}', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"430\",\"cLTxt\":null,\"cHTxt\":\"PM10-IAQ Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"350\",\"wLTxt\":null,\"wHTxt\":\"PM10-IAQ Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"1001\",\"oLTxt\":\"PM10-IAQ Out Of Range Low Alarm\",\"oHTxt\":\"PM10-IAQ Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Modbus', '0', 'µg/m3', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(30, 1, 1, 1, 1, 3, 5, 12, NULL, 'AQI', 'PM2.5', 'PM2.5-OAQI', NULL, NULL, 4.9600, 'UnLatch', 0, NULL, 1, 1, 1, NULL, NULL, '{\"minR\":\"4\",\"minRS\":\"0\",\"maxR\":\"20\",\"maxRS\":\"1000\"}', '{\"stelLimit\":\"90\",\"stelDuration\":\"15\",\"stelAlert\":\"PM2.5 STEL Alert\"}', '{\"shift1\":{\"twaShiftId\":\"TWA1\",\"twaLimit\":\"60\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"PM2.5 TWA Alert\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"250\",\"cLTxt\":null,\"cHTxt\":\"PM2.5 Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"120\",\"wLTxt\":null,\"wHTxt\":\"PM2.5 Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"1001\",\"oLTxt\":\"PM2.5 Out Of Range Low Alarm\",\"oHTxt\":\"PM2.5 Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', 'µg/m3', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(31, 1, 1, 1, 1, 3, 5, 12, NULL, 'AQI', 'PM10', 'PM10-OAQI', NULL, NULL, 6.8000, 'UnLatch', 0, NULL, 1, 1, 1, NULL, NULL, '{\"minR\":\"4\",\"minRS\":\"0\",\"maxR\":\"20\",\"maxRS\":\"1000\"}', '{\"stelLimit\":\"250\",\"stelDuration\":\"15\",\"stelAlert\":\"PM10 STEL Alert\"}', '{\"shift1\":{\"twaShiftId\":\"TWA2\",\"twaLimit\":\"100\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"PM10 TWA Alert\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"430\",\"cLTxt\":null,\"cHTxt\":\"PM10 Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"350\",\"wLTxt\":null,\"wHTxt\":\"PM10 Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"1001\",\"oLTxt\":\"PM10 Out Of Range Low Alarm\",\"oHTxt\":\"PM10 Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', 'µg/m3', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(42, 1, 1, 1, 1, 1, 1, 3, NULL, 'AQI', 'SO2', 'SO2-IAQI', NULL, NULL, 0.0120, 'Latch', 0, NULL, 1, 1, 1, NULL, NULL, '{\"minR\":\"0\",\"minRS\":\"0\",\"maxR\":\"15\",\"maxRS\":\"15\"}', '{\"stelLimit\":\"5\",\"stelDuration\":\"15\",\"stelAlert\":\"STEL SO2 Alert\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"2\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"TWA SO2 Alert\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"4\",\"cLTxt\":null,\"cHTxt\":\"SO2 Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"2\",\"wLTxt\":null,\"wHTxt\":\"SO2 Warning High Alarm\"}', '{\"oAT\":\"High\",\"oMin\":\"-1\",\"oMax\":\"16\",\"oLTxt\":null,\"oHTxt\":\"SO2 Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', 'ppm', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(43, 1, 1, 1, 1, 1, 1, 3, NULL, 'AQI', 'NO2', 'NO2-IAQI', NULL, NULL, 0.0010, 'Latch', 0, NULL, 1, 1, 1, NULL, NULL, '{\"minR\":\"0\",\"minRS\":\"0\",\"maxR\":\"10\",\"maxRS\":\"10\"}', '{\"stelLimit\":\"5\",\"stelDuration\":\"15\",\"stelAlert\":\"NO2 STEL Alert\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"2.5\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"NO2 TWA Alert\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"5\",\"cLTxt\":null,\"cHTxt\":\"NO2 Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"2.5\",\"wLTxt\":null,\"wHTxt\":\"NO2 Warning High Alarm\"}', '{\"oAT\":\"High\",\"oMin\":\"-1\",\"oMax\":\"11\",\"oLTxt\":null,\"oHTxt\":\"NO2 Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', 'ppm', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(44, 1, 1, 1, 1, 3, 5, 12, NULL, 'AQI', 'SO2', 'SO2-OAQI', NULL, NULL, 5.0665, 'Latch', 0, NULL, 1, 1, 1, NULL, NULL, '{\"minR\":\"4\",\"minRS\":\"0\",\"maxR\":\"20\",\"maxRS\":\"15\"}', '{\"stelLimit\":\"5\",\"stelDuration\":\"15\",\"stelAlert\":\"STEL SO2 Alert\"}', '{\"shift1\":{\"twaShiftId\":\"TWA3\",\"twaLimit\":\"2\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"TWA SO2 Alert\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"4\",\"cLTxt\":null,\"cHTxt\":\"SO2 Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"2\",\"wLTxt\":null,\"wHTxt\":\"SO2 Warning High Alarm\"}', '{\"oAT\":\"High\",\"oMin\":\"-1\",\"oMax\":\"16\",\"oLTxt\":null,\"oHTxt\":\"SO2 Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', 'ppm', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(45, 1, 1, 1, 1, 3, 5, 12, NULL, 'AQI', 'NO2', 'NO2-OAQI', NULL, NULL, 3.0000, 'Latch', 0, NULL, 1, 1, 1, NULL, NULL, '{\"minR\":\"4\",\"minRS\":\"0\",\"maxR\":\"20\",\"maxRS\":\"10\"}', '{\"stelLimit\":\"5\",\"stelDuration\":\"15\",\"stelAlert\":\"NO2 STEL Alert\"}', '{\"shift1\":{\"twaShiftId\":\"TWA4\",\"twaLimit\":\"2.5\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"NO2 TWA Alert\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"5\",\"cLTxt\":null,\"cHTxt\":\"NO2 Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"2.5\",\"wLTxt\":null,\"wHTxt\":\"NO2 Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"0\",\"oMax\":\"10\",\"oLTxt\":null,\"oHTxt\":\"NO2 Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', 'ppm', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(54, 1, 1, 1, 1, 1, 3, 16, NULL, 'AQMi', 'Temperature-IAQ', 'Temp', NULL, NULL, 260.0000, 'UnLatch', NULL, NULL, 0, 0, 0, NULL, NULL, '{\"minR\":\"-100\",\"maxR\":\"700\",\"minRS\":\"-10\",\"maxRS\":\"70\"}', '{\"stelLimit\":\"0\",\"stelDuration\":null,\"stelAlert\":null}', '[]', '[]', '{\"cAT\":\"Both\",\"cMin\":\"2\",\"cMax\":\"45\",\"cLTxt\":\"Critical Low Alarm\",\"cHTxt\":\"Critical High Alarm\"}', '{\"wAT\":\"Both\",\"wMin\":\"5\",\"wMax\":\"40\",\"wLTxt\":\"Warning Low Alarm\",\"wHTxt\":\"Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-11\",\"oMax\":\"71\",\"oLTxt\":\"Temperature-IAQ Out Of Range Low Alarm\",\"oHTxt\":\"Temperature-IAQ Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Modbus', '0', '°C', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(61, 1, 1, 1, 1, 1, 3, 16, NULL, 'AQMi', 'Humidity-IAQ', 'Humid-BSC', NULL, NULL, 50.0000, 'UnLatch', NULL, NULL, 0, 0, 0, NULL, NULL, '{\"minR\":\"0\",\"maxR\":\"100\",\"minRS\":\"0\",\"maxRS\":\"100\"}', '{\"stelLimit\":\"0\",\"stelDuration\":null,\"stelAlert\":null}', '[]', '[]', '{\"cAT\":\"High\",\"cMin\":\"5\",\"cMax\":\"95\",\"cLTxt\":null,\"cHTxt\":\"Humidity-IAQ Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"10\",\"wMax\":\"90\",\"wLTxt\":null,\"wHTxt\":\"Humidity-IAQ Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"101\",\"oLTxt\":\"Humidity-IAQ Out Of Range Low Alarm\",\"oHTxt\":\"Humidity-IAQ Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Modbus', '0', '%', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(62, 1, 1, 1, 1, 1, 3, 16, NULL, 'AQMi', 'TVOC-IAQ', 'TVOC-BSC', NULL, NULL, 900.0000, 'UnLatch', NULL, NULL, 0, 0, 0, NULL, NULL, '{\"minR\":\"0\",\"maxR\":\"45000\",\"minRS\":\"0\",\"maxRS\":\"45000\"}', '{\"stelLimit\":\"0\",\"stelDuration\":null,\"stelAlert\":null}', '[]', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"3600\",\"cLTxt\":null,\"cHTxt\":\"TVOC-IAQ Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"1800\",\"wLTxt\":null,\"wHTxt\":\"TVOC-IAQ Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"45001\",\"oLTxt\":\"TVOC-IAQ Out Of Range Low Alarm\",\"oHTxt\":\"TVOC-IAQ Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Modbus', '0', 'µg/m3', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(63, 1, 1, 1, 1, 1, 3, 16, NULL, 'AQMi', 'CO2-IAQ', 'CO2-BSC', NULL, NULL, 2500.0000, 'UnLatch', NULL, NULL, 1, 1, 0, NULL, NULL, '{\"minR\":\"0\",\"maxR\":\"5000\",\"minRS\":\"0\",\"maxRS\":\"5000\"}', '{\"stelLimit\":\"30000\",\"stelDuration\":\"15\",\"stelAlert\":\"CO2 STEL Alert\"}', '{\"shift1\":{\"twaLimit\":\"5000\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"CO2 TWA Alert\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"10000\",\"cLTxt\":null,\"cHTxt\":\"CO2-IAQ Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"5000\",\"wLTxt\":null,\"wHTxt\":\"CO2-IAQ Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"5001\",\"oLTxt\":\"CO2-IAQ Out Of Range Low Alarm\",\"oHTxt\":\"CO2-IAQ Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Modbus', '0', 'ppm', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(64, 1, 1, 1, 1, 1, 3, 16, NULL, 'AQMi', 'PM2.5-IAQ', 'PM2.5-BSC', NULL, NULL, 60.0000, 'UnLatch', NULL, NULL, 1, 1, 0, NULL, NULL, '{\"minR\":\"0\",\"maxR\":\"1000\",\"minRS\":\"0\",\"maxRS\":\"1000\"}', '{\"stelLimit\":\"90\",\"stelDuration\":\"15\",\"stelAlert\":\"PM2.5 STEL Alert\"}', '{\"shift1\":{\"twaLimit\":\"60\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"PM2.5 TWA Alert\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"250\",\"cLTxt\":null,\"cHTxt\":\"PM2.5-IAQ Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"120\",\"wLTxt\":null,\"wHTxt\":\"PM2.5-IAQ Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"1001\",\"oLTxt\":\"PM2.5-IAQ Out Of Range Low Alarm\",\"oHTxt\":\"PM2.5-IAQ Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Modbus', '0', 'µg/m3', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(65, 1, 1, 1, 1, 1, 3, 16, NULL, 'AQMi', 'PM10-IAQ', 'PM10-BSC', NULL, NULL, 175.0000, 'UnLatch', NULL, NULL, 1, 1, 0, NULL, NULL, '{\"minR\":\"0\",\"maxR\":\"1000\",\"minRS\":\"0\",\"maxRS\":\"1000\"}', '{\"stelLimit\":\"250\",\"stelDuration\":\"15\",\"stelAlert\":\"PM10 STEL Alert\"}', '{\"shift1\":{\"twaLimit\":\"100\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"PM10 TWA Alert\"},\"shift2\":{\"twaLimit\":\"100\",\"twaDuration\":480,\"twaStartTime\":\"16:30:00\",\"twaAlert\":\"PM10 TWA Alert-Shift2\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"430\",\"cLTxt\":null,\"cHTxt\":\"PM10-IAQ Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"350\",\"wLTxt\":null,\"wHTxt\":\"PM10-IAQ Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"-1\",\"oMax\":\"1001\",\"oLTxt\":\"PM10-IAQ Out Of Range Low Alarm\",\"oHTxt\":\"PM10-IAQ Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Modbus', '0', 'µg/m3', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(66, 1, 1, 1, 1, 1, 1, 20, NULL, 'AQMi', 'Noise Meter', 'CNC-Noise', NULL, NULL, 10.2220, 'UnLatch', NULL, NULL, 1, 1, 0, NULL, NULL, '{\"minR\":\"4\",\"maxR\":\"20\",\"minRS\":\"30\",\"maxRS\":\"120\"}', '{\"stelLimit\":\"100\",\"stelDuration\":\"15\",\"stelAlert\":\"Noise STEL Alert\"}', '{\"shift1\":{\"twaLimit\":\"85\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"Noise TWA Alert\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"110\",\"cLTxt\":null,\"cHTxt\":\"Noise Meter Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"-3\",\"wMax\":\"85\",\"wLTxt\":null,\"wHTxt\":\"Noise Meter Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"29\",\"oMax\":\"121\",\"oLTxt\":\"Noise Meter Out Of Range Low Alarm\",\"oHTxt\":\"Noise Meter Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', 'db', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(67, 1, 1, 1, 1, 1, 1, 21, NULL, 'AQMi', 'Noise Meter', 'CNC-Noise', NULL, NULL, 10.2220, 'UnLatch', NULL, NULL, 1, 1, 0, NULL, NULL, '{\"minR\":\"4\",\"maxR\":\"20\",\"minRS\":\"30\",\"maxRS\":\"120\"}', '{\"stelLimit\":\"100\",\"stelDuration\":\"15\",\"stelAlert\":\"Noise STEL Alert\"}', '{\"shift1\":{\"twaLimit\":\"85\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"Noise TWA Alert\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"110\",\"cLTxt\":null,\"cHTxt\":\"Noise Meter Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"-3\",\"wMax\":\"85\",\"wLTxt\":null,\"wHTxt\":\"Noise Meter Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"29\",\"oMax\":\"121\",\"oLTxt\":\"Noise Meter Out Of Range Low Alarm\",\"oHTxt\":\"Noise Meter Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', 'db', 1, 1, NULL, NULL, '2024-01-31 07:32:08', '2024-01-31 07:32:08'),
(72, 1, 1, 1, 1, 1, 2, 2, NULL, 'AQMo', 'Temperature - IAQ', 'test-32', NULL, NULL, 5.9600, 'Latch', 0, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '{\"cAT\":\"High\",\"cMin\":\"10\",\"cMax\":\"45\",\"cLTxt\":\"Temperature - IAQ Critical Low Alert\",\"cHTxt\":\"Temperature - IAQ Critical High Alert\"}', '{\"wAT\":\"High\",\"wMin\":\"12\",\"wMax\":\"40\",\"wLTxt\":\"Temperature - IAQ Warning Low Alert\",\"wHTxt\":\"Temperature - IAQ Warning High Alert\"}', '{\"oAT\":\"Both\",\"oMin\":\"-40\",\"oMax\":\"85\",\"oLTxt\":\"Temperature - IAQ Out Of Range Low Alert\",\"oHTxt\":\"Temperature - IAQ Out Of Range High Alert\"}', 0.000, 0.000, NULL, 'Inbuilt', '0', '°C', 1, 1, NULL, NULL, '2024-02-16 04:52:15', '2024-02-16 04:52:15'),
(97, 1, 1, 1, 1, 1, 2, 2, NULL, 'IAQ', 'PM10 - IAQ-Copy', 'PM-Copy', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, NULL, NULL, '{\"stelLimit\":\"250\",\"stelDuration\":\"15\",\"stelAlert\":\"PM10 - IAQ STEL Alert\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"100\",\"twaDuration\":\"480\",\"twaStartTime\":\"13:21\",\"twaAlert\":\"PM10 - IAQ TWA Alert\"}}', NULL, '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"430\",\"cLTxt\":\"PM10 - IAQ Critical Low Alert\",\"cHTxt\":\"PM10 - IAQ Critical High Alert\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"350\",\"wLTxt\":\"PM10 - IAQ Warning Low Alert\",\"wHTxt\":\"PM10 - IAQ Warning High Alert\"}', '{\"oAT\":\"Both\",\"oMin\":\"0\",\"oMax\":\"1000\",\"oLTxt\":\"PM10 - IAQ Out Of Range Low Alert\",\"oHTxt\":\"PM10 - IAQ Out Of Range High Alert\"}', 0.000, 0.000, NULL, 'Inbuilt', '0', 'µg/m3', 1, 1, NULL, NULL, '2024-02-18 08:08:43', '2024-02-18 08:08:43'),
(108, 1, 1, 1, 1, 1, 2, 2, NULL, 'AQMo', 'PM10 - IAQ', 'demo-2', NULL, NULL, NULL, 'Latch', 0, NULL, 0, 0, 0, NULL, NULL, NULL, '{\"stelLimit\":\"250\",\"stelDuration\":\"15\",\"stelAlert\":\"PM10 - IAQ STEL Alert\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"100\",\"twaDuration\":\"480\",\"twaStartTime\":\"13:21\",\"twaAlert\":\"PM10 - IAQ TWA Alert\"}}', NULL, '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"430\",\"cLTxt\":\"PM10 - IAQ Critical Low Alert\",\"cHTxt\":\"PM10 - IAQ Critical High Alert\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"350\",\"wLTxt\":\"PM10 - IAQ Warning Low Alert\",\"wHTxt\":\"PM10 - IAQ Warning High Alert\"}', '{\"oAT\":\"Both\",\"oMin\":\"0\",\"oMax\":\"1000\",\"oLTxt\":\"PM10 - IAQ Out Of Range Low Alert\",\"oHTxt\":\"PM10 - IAQ Out Of Range High Alert\"}', 0.000, 0.000, NULL, 'Inbuilt', '1', 'µg/m3', 1, 1, NULL, NULL, '2024-03-01 04:25:57', '2024-03-01 04:25:57'),
(116, 1, 1, 1, 1, 1, 2, 5, NULL, 'AQI', 'NO2 - AQI', 'NO2-te', NULL, NULL, 6.0000, 'Latch', 0, NULL, 1, 1, 0, NULL, NULL, '{\"minR\":\"4\",\"minRS\":\"0\",\"maxR\":\"20\",\"maxRS\":\"10\"}', '{\"stelLimit\":\"5\",\"stelDuration\":\"15\",\"stelAlert\":\"NO2 - AQI STEL Alert\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"2.5\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:11\",\"twaAlert\":\"NO2 - AQI TWA Alert\"}}', NULL, '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"5\",\"cLTxt\":\"NO2 - AQI Critical Low Alert\",\"cHTxt\":\"NO2 - AQI Critical High Alert\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"2.5\",\"wLTxt\":\"NO2 - AQI Warning Low Alert\",\"wHTxt\":\"NO2 - AQI Warning High Alert\"}', '{\"oAT\":\"High\",\"oMin\":\"-1\",\"oMax\":\"11\",\"oLTxt\":\"NO2 - AQI Out Of Range Low Alert\",\"oHTxt\":\"NO2 - AQI Out Of Range High Alert\"}', 0.000, 0.000, NULL, 'Analog', '0', 'ppm', 1, 1, NULL, NULL, '2024-03-04 07:22:01', '2024-03-04 07:22:01'),
(143, 1, 1, 1, 1, 2, 4, 11, NULL, 'IAQ', 'PM2.5 - AQI', 'PM2.5', NULL, 'A1', 50.0000, 'Latch', 0, NULL, 1, 1, 0, NULL, NULL, '{\"minR\":\"0\",\"minRS\":\"0\",\"maxR\":\"1000\",\"maxRS\":\"1000\"}', '{\"stelLimit\":\"90\",\"stelDuration\":\"15\",\"stelAlert\":\"PM2.5 - AQI STEL Alert\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"60\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:03\",\"twaAlert\":\"PM2.5 - AQI TWA Alert\"}}', NULL, '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"250\",\"cLTxt\":\"PM2.5 - AQI Critical Low Alert\",\"cHTxt\":\"PM2.5 - AQI Critical High Alert\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"120\",\"wLTxt\":\"PM2.5 - AQI Warning Low Alert\",\"wHTxt\":\"PM2.5 - AQI Warning High Alert\"}', '{\"oAT\":\"Both\",\"oMin\":\"0\",\"oMax\":\"1000\",\"oLTxt\":\"PM2.5 - AQI Out Of Range Low Alert\",\"oHTxt\":\"PM2.5 - AQI Out Of Range High Alert\"}', 0.000, 0.000, NULL, 'Analog', '1', 'µg/m3', 1, 1, NULL, NULL, '2024-03-20 09:42:58', '2024-03-20 09:42:58'),
(144, 1, 1, 1, 1, 2, 4, 11, NULL, 'IAQ', 'Humidity - IAQ', 'Humidity', NULL, 'A1', 30.0000, 'Latch', 0, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"95\",\"cLTxt\":\"Humidity - IAQ Critical Low Alert\",\"cHTxt\":\"Humidity - IAQ Critical High Alert\"}', '{\"wAT\":\"High\",\"wMin\":\"0\",\"wMax\":\"90\",\"wLTxt\":\"Humidity - IAQ Warning Low Alert\",\"wHTxt\":\"Humidity - IAQ Warning High Alert\"}', '{\"oAT\":\"Both\",\"oMin\":\"0\",\"oMax\":\"100\",\"oLTxt\":\"Humidity - IAQ Out Of Range Low Alert\",\"oHTxt\":\"Humidity - IAQ Out Of Range High Alert\"}', 0.000, 0.000, NULL, 'Inbuilt', '1', '%', 1, 1, NULL, NULL, '2024-03-20 09:54:02', '2024-03-20 09:54:02'),
(169, 1, 1, 1, 1, 1, 2, 2, NULL, 'AQMi', 'Noise Meter-Copy', 'CNC-Noise-Copy', NULL, NULL, 10.2220, 'UnLatch', NULL, NULL, 1, 1, 0, NULL, NULL, '{\"minR\":\"4\",\"maxR\":\"20\",\"minRS\":\"30\",\"maxRS\":\"120\"}', '{\"stelLimit\":\"100\",\"stelDuration\":\"15\",\"stelAlert\":\"Noise STEL Alert\"}', '{\"shift1\":{\"twaLimit\":\"85\",\"twaDuration\":480,\"twaStartTime\":\"08:30:00\",\"twaAlert\":\"Noise TWA Alert\"}}', '[]', '{\"cAT\":\"High\",\"cMin\":\"0\",\"cMax\":\"110\",\"cLTxt\":null,\"cHTxt\":\"Noise Meter Critical High Alarm\"}', '{\"wAT\":\"High\",\"wMin\":\"-3\",\"wMax\":\"85\",\"wLTxt\":null,\"wHTxt\":\"Noise Meter Warning High Alarm\"}', '{\"oAT\":\"Both\",\"oMin\":\"29\",\"oMax\":\"121\",\"oLTxt\":\"Noise Meter Out Of Range Low Alarm\",\"oHTxt\":\"Noise Meter Out Of Range High Alarm\"}', 0.000, 0.000, '[]', 'Analog', '0', 'db', 1, 1, NULL, NULL, '2024-03-29 10:07:18', '2024-03-29 10:07:18');

-- --------------------------------------------------------

--
-- Table structure for table `sensorsType`
--

CREATE TABLE `sensorsType` (
  `id` int NOT NULL,
  `deviceCategory` varchar(64) DEFAULT NULL,
  `sensorType` varchar(128) DEFAULT NULL,
  `sensorTag` varchar(128) DEFAULT NULL,
  `sensorCategory` varchar(64) DEFAULT NULL,
  `defaultValue` decimal(8,4) DEFAULT NULL,
  `alarmType` varchar(64) DEFAULT NULL COMMENT 'Latch,UnLatch',
  `bumpTest` tinyint(1) DEFAULT NULL,
  `calibrationTest` tinyint(1) DEFAULT NULL,
  `isStel` tinyint(1) DEFAULT NULL,
  `isTwa` tinyint(1) DEFAULT NULL,
  `isAQI` tinyint(1) DEFAULT NULL,
  `bumpInfo` text,
  `calibrationInfo` text,
  `scaleInfo` text,
  `stelInfo` text,
  `twaInfo` text,
  `modBusInfo` text,
  `criticalAlertInfo` text,
  `warningAlertInfo` text,
  `outOfRangeAlertInfo` text,
  `nMin` decimal(11,3) DEFAULT NULL,
  `nMax` decimal(11,3) DEFAULT NULL,
  `digitalAlertInfo` text,
  `sensorOutput` varchar(64) DEFAULT NULL,
  `units` varchar(64) DEFAULT NULL,
  `manufacturer` varchar(255) DEFAULT NULL,
  `partID` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sensorsType`
--

INSERT INTO `sensorsType` (`id`, `deviceCategory`, `sensorType`, `sensorTag`, `sensorCategory`, `defaultValue`, `alarmType`, `bumpTest`, `calibrationTest`, `isStel`, `isTwa`, `isAQI`, `bumpInfo`, `calibrationInfo`, `scaleInfo`, `stelInfo`, `twaInfo`, `modBusInfo`, `criticalAlertInfo`, `warningAlertInfo`, `outOfRangeAlertInfo`, `nMin`, `nMax`, `digitalAlertInfo`, `sensorOutput`, `units`, `manufacturer`, `partID`, `createdAt`, `modifiedAt`) VALUES
(6, NULL, 'Temperature - IAQ', NULL, NULL, NULL, 'Latch', 0, NULL, 0, 0, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{}', '{}', NULL, '{\"cMin\":\"10\",\"cMax\":\"45\"}', '{\"wMin\":\"12\",\"wMax\":\"40\"}', '{\"oMin\":\"-40\",\"oMax\":\"85\"}', NULL, NULL, NULL, '4', '7', NULL, NULL, '2024-02-14 07:45:50', '2024-02-14 07:45:50'),
(7, NULL, 'Humidity - IAQ', NULL, NULL, NULL, 'Latch', 0, NULL, 0, 0, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{}', '{}', NULL, '{\"cMin\":\"0\",\"cMax\":\"95\"}', '{\"wMin\":\"0\",\"wMax\":\"90\"}', '{\"oMin\":\"0\",\"oMax\":\"100\"}', NULL, NULL, NULL, '4', '8', NULL, NULL, '2024-02-14 07:47:33', '2024-02-14 07:47:33'),
(8, NULL, 'TVOC - IAQ', NULL, NULL, NULL, 'Latch', 0, NULL, 0, 0, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{}', '{}', NULL, '{\"cMin\":\"0\",\"cMax\":\"3600\"}', '{\"wMin\":\"0\",\"wMax\":\"1800\"}', '{\"oMin\":\"0\",\"oMax\":\"65000\"}', NULL, NULL, NULL, '4', '2', NULL, NULL, '2024-02-14 07:48:53', '2024-02-14 07:48:53'),
(9, NULL, 'CO2 - IAQ', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"30000\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"5000\",\"twaDuration\":\"480\",\"twaStartTime\":\"13:18\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"10000\"}', '{\"wMin\":\"0\",\"wMax\":\"5000\"}', '{\"oMin\":\"0\",\"oMax\":\"32000\"}', NULL, NULL, NULL, '4', '1', NULL, NULL, '2024-02-14 07:51:28', '2024-02-14 07:51:28'),
(10, NULL, 'PM10 - IAQ', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"250\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"100\",\"twaDuration\":\"480\",\"twaStartTime\":\"13:21\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"430\"}', '{\"wMin\":\"0\",\"wMax\":\"350\"}', '{\"oMin\":\"0\",\"oMax\":\"1000\"}', NULL, NULL, NULL, '4', '3', NULL, NULL, '2024-02-14 07:53:06', '2024-02-14 07:53:06'),
(11, NULL, 'PM2.5 - IAQ', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"90\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"60\",\"twaDuration\":\"480\",\"twaStartTime\":\"13:23\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"250\"}', '{\"wMin\":\"0\",\"wMax\":\"120\"}', '{\"oMin\":\"0\",\"oMax\":\"1000\"}', NULL, NULL, NULL, '4', '3', NULL, NULL, '2024-02-14 07:54:50', '2024-02-14 07:54:50'),
(12, NULL, 'Oxygen - IAQ', NULL, NULL, NULL, 'Latch', 0, NULL, 0, 0, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{}', '{}', NULL, '{\"cMin\":\"16\",\"cMax\":\"24\"}', '{\"wMin\":\"19.5\",\"wMax\":\"22.5\"}', '{\"oMin\":\"0\",\"oMax\":\"25\"}', NULL, NULL, NULL, '4', '5', NULL, NULL, '2024-02-14 07:56:51', '2024-02-14 07:56:51'),
(13, NULL, 'TVOC - SEM', NULL, NULL, NULL, 'Latch', 0, NULL, 0, 0, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{}', '{}', NULL, '{\"cMin\":\"0\",\"cMax\":\"3600\"}', '{\"wMin\":\"0\",\"wMax\":\"1800\"}', '{\"oMin\":\"0\",\"oMax\":\"65000\"}', NULL, NULL, NULL, '4', '2', NULL, NULL, '2024-02-14 08:33:57', '2024-02-14 08:33:57'),
(14, NULL, 'eCO2 - SEM', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"30000\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"5000\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:04\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"10000\"}', '{\"wMin\":\"0\",\"wMax\":\"5000\"}', '{\"oMin\":\"400\",\"oMax\":\"65000\"}', NULL, NULL, NULL, '4', '1', NULL, NULL, '2024-02-14 08:35:41', '2024-02-14 08:35:41'),
(15, NULL, 'PM10 - SEM', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"250\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"100\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:05\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"430\"}', '{\"wMin\":\"0\",\"wMax\":\"350\"}', '{\"oMin\":\"0\",\"oMax\":\"1000\"}', NULL, NULL, NULL, '4', '3', NULL, NULL, '2024-02-14 08:37:14', '2024-02-14 08:37:14'),
(16, NULL, 'PM2.5 - SEM', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"90\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"60\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:09\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"250\"}', '{\"wMin\":\"0\",\"wMax\":\"120\"}', '{\"oMin\":\"0\",\"oMax\":\"1000\"}', NULL, NULL, NULL, '4', '3', NULL, NULL, '2024-02-14 08:40:21', '2024-02-14 08:40:21'),
(17, NULL, 'Oxygen - SEM', NULL, NULL, NULL, 'Latch', 0, NULL, 0, 0, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{}', '{}', NULL, '{\"cMin\":\"16\",\"cMax\":\"24\"}', '{\"wMin\":\"24\",\"wMax\":\"19.5\"}', '{\"oMin\":\"0\",\"oMax\":\"25\"}', NULL, NULL, NULL, '4', '5', NULL, NULL, '2024-02-14 08:41:26', '2024-02-14 08:41:26'),
(18, NULL, 'CH4 - SEM', NULL, NULL, NULL, 'Latch', 0, NULL, 0, 0, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{}', '{}', NULL, '{\"cMin\":\"0\",\"cMax\":\"40\"}', '{\"wMin\":\"0\",\"wMax\":\"20\"}', '{\"oMin\":\"0\",\"oMax\":\"100\"}', NULL, NULL, NULL, '4', '6', NULL, NULL, '2024-02-14 08:42:58', '2024-02-14 08:42:58'),
(19, NULL, 'C2H4 - SEM', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"5\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"1\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:13\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"10\"}', '{\"wMin\":\"0\",\"wMax\":\"5\"}', '{\"oMin\":\"0\",\"oMax\":\"100\"}', NULL, NULL, NULL, '4', '1', NULL, NULL, '2024-02-14 08:44:07', '2024-02-14 08:44:07'),
(20, NULL, 'Cl2 - SEM', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"0.5\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"0.25\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:14\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"1\"}', '{\"wMin\":\"0\",\"wMax\":\"0.5\"}', '{\"oMin\":\"0\",\"oMax\":\"20\"}', NULL, NULL, NULL, '4', '1', NULL, NULL, '2024-02-14 08:45:18', '2024-02-14 08:45:18'),
(21, NULL, 'CO - SEM', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"100\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"50\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:15\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"200\"}', '{\"wMin\":\"0\",\"wMax\":\"100\"}', '{\"oMin\":\"0\",\"oMax\":\"1000\"}', NULL, NULL, NULL, '4', '1', NULL, NULL, '2024-02-14 08:47:16', '2024-02-14 08:47:16'),
(22, NULL, 'Ethylene Oxide - SEM', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"5\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"1\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:17\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"10\"}', '{\"wMin\":\"0\",\"wMax\":\"5\"}', '{\"oMin\":\"0\",\"oMax\":\"100\"}', NULL, NULL, NULL, '4', '1', NULL, NULL, '2024-02-14 08:48:14', '2024-02-14 08:48:14'),
(23, NULL, 'H2 - SEM', NULL, NULL, NULL, 'Latch', 0, NULL, 0, 0, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{}', '{}', NULL, '{\"cMin\":\"0\",\"cMax\":\"16000\"}', '{\"wMin\":\"0\",\"wMax\":\"8000\"}', '{\"oMin\":\"0\",\"oMax\":\"1000\"}', NULL, NULL, NULL, '4', '1', NULL, NULL, '2024-02-14 08:58:58', '2024-02-14 08:58:58'),
(24, NULL, 'H2S - SEM', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"15\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"10\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:35\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"50\"}', '{\"wMin\":\"0\",\"wMax\":\"15\"}', '{\"oMin\":\"0\",\"oMax\":\"100\"}', NULL, NULL, NULL, '4', '1', NULL, NULL, '2024-02-14 09:07:28', '2024-02-14 09:07:28'),
(25, NULL, 'HCl - SEM', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"2.5\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"1.25\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:37\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"5\"}', '{\"wMin\":\"0\",\"wMax\":\"2.5\"}', '{\"oMin\":\"0\",\"oMax\":\"10\"}', NULL, NULL, NULL, '4', '1', NULL, NULL, '2024-02-14 09:16:51', '2024-02-14 09:16:51'),
(26, NULL, 'HF - SEM', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"6\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"3\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:46\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"12\"}', '{\"wMin\":\"0\",\"wMax\":\"6\"}', '{\"oMin\":\"0\",\"oMax\":\"10\"}', NULL, NULL, NULL, '4', '1', NULL, NULL, '2024-02-14 09:17:53', '2024-02-14 09:17:53'),
(27, NULL, 'NH3 - SEM', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"100\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"50\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:49\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"200\"}', '{\"wMin\":\"0\",\"wMax\":\"100\"}', '{\"oMin\":\"0\",\"oMax\":\"100\"}', NULL, NULL, NULL, '4', '1', NULL, NULL, '2024-02-14 09:21:39', '2024-02-14 09:21:39'),
(28, NULL, 'NO2 - SEM', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"2.5\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"1.25\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:51\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"5\"}', '{\"wMin\":\"0\",\"wMax\":\"2.5\"}', '{\"oMin\":\"0\",\"oMax\":\"20\"}', NULL, NULL, NULL, '4', '1', NULL, NULL, '2024-02-14 09:26:06', '2024-02-14 09:26:06'),
(29, NULL, 'O3 - SEM', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"0.2\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"0.1\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:56\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"0.4\"}', '{\"wMin\":\"0\",\"wMax\":\"0.2\"}', '{\"oMin\":\"0\",\"oMax\":\"10\"}', NULL, NULL, NULL, '4', '1', NULL, NULL, '2024-02-14 09:27:24', '2024-02-14 09:27:24'),
(30, NULL, 'SO2 - SEM', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"10\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"5\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:57\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"20\"}', '{\"wMin\":\"0\",\"wMax\":\"10\"}', '{\"oMin\":\"0\",\"oMax\":\"20\"}', NULL, NULL, NULL, '4', '1', NULL, NULL, '2024-02-14 09:29:41', '2024-02-14 09:29:41'),
(31, NULL, 'PM10 - AQI', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"250\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"100\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:59\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"430\"}', '{\"wMin\":\"0\",\"wMax\":\"350\"}', '{\"oMin\":\"0\",\"oMax\":\"1001\"}', NULL, NULL, NULL, '2', '3', NULL, NULL, '2024-02-14 09:31:57', '2024-02-14 09:31:57'),
(32, NULL, 'PM10 - AQI - MOD', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"250\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"100\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:02\"}}', '{\"slaveID\":\"\",\"register\":\"\",\"bitLength\":\"\"}', '{\"cMin\":\"0\",\"cMax\":\"430\"}', '{\"wMin\":\"0\",\"wMax\":\"350\"}', '{\"oMin\":\"0\",\"oMax\":\"1000\"}', NULL, NULL, NULL, '6', '3', NULL, NULL, '2024-02-14 09:33:14', '2024-02-14 09:33:14'),
(33, NULL, 'PM2.5 - AQI', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"90\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"60\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:03\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"250\"}', '{\"wMin\":\"0\",\"wMax\":\"120\"}', '{\"oMin\":\"0\",\"oMax\":\"1000\"}', NULL, NULL, NULL, '2', '3', NULL, NULL, '2024-02-14 09:34:27', '2024-02-14 09:34:27'),
(34, NULL, 'PM2.5 - AQI', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"90\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"60\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:04\"}}', '{\"slaveID\":\"\",\"register\":\"\",\"bitLength\":\"\"}', '{\"cMin\":\"0\",\"cMax\":\"250\"}', '{\"wMin\":\"0\",\"wMax\":\"120\"}', '{\"oMin\":\"0\",\"oMax\":\"1000\"}', NULL, NULL, NULL, '6', '3', NULL, NULL, '2024-02-14 09:35:38', '2024-02-14 09:35:38'),
(35, NULL, 'CO - AQI', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"100\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"50\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:05\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"200\"}', '{\"wMin\":\"0\",\"wMax\":\"100\"}', '{\"oMin\":\"0\",\"oMax\":\"1000\"}', NULL, NULL, NULL, '2', '1', NULL, NULL, '2024-02-14 09:37:21', '2024-02-14 09:37:21'),
(36, NULL, 'CO - AQI', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"100\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"50\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:07\"}}', '{\"slaveID\":\"\",\"register\":\"\",\"bitLength\":\"\"}', '{\"cMin\":\"0\",\"cMax\":\"200\"}', '{\"wMin\":\"0\",\"wMax\":\"100\"}', '{\"oMin\":\"0\",\"oMax\":\"1000\"}', NULL, NULL, NULL, '6', '1', NULL, NULL, '2024-02-14 09:38:44', '2024-02-14 09:38:44'),
(37, NULL, 'NH3 - AQI', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"100\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"50\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:08\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"200\"}', '{\"wMin\":\"0\",\"wMax\":\"100\"}', '{\"oMin\":\"0\",\"oMax\":\"100\"}', NULL, NULL, NULL, '2', '1', NULL, NULL, '2024-02-14 09:40:34', '2024-02-14 09:40:34'),
(38, NULL, 'NH3 - AQI', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"100\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"50\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:10\"}}', '{\"slaveID\":\"\",\"register\":\"\",\"bitLength\":\"\"}', '{\"cMin\":\"0\",\"cMax\":\"200\"}', '{\"wMin\":\"0\",\"wMax\":\"100\"}', '{\"oMin\":\"0\",\"oMax\":\"100\"}', NULL, NULL, NULL, '6', '1', NULL, NULL, '2024-02-14 09:41:33', '2024-02-14 09:41:33'),
(39, NULL, 'NO2 - AQI', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"2.5\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"1.25\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:11\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"5\"}', '{\"wMin\":\"0\",\"wMax\":\"2.5\"}', '{\"oMin\":\"0\",\"oMax\":\"20\"}', NULL, NULL, NULL, '2', '1', NULL, NULL, '2024-02-14 09:42:50', '2024-02-14 09:42:50'),
(40, NULL, 'NO2 - AQI', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"2.5\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"1.25\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:12\"}}', '{\"slaveID\":\"\",\"register\":\"\",\"bitLength\":\"\"}', '{\"cMin\":\"0\",\"cMax\":\"5\"}', '{\"wMin\":\"0\",\"wMax\":\"2.5\"}', '{\"oMin\":\"0\",\"oMax\":\"20\"}', NULL, NULL, NULL, '6', '1', NULL, NULL, '2024-02-14 09:44:01', '2024-02-14 09:44:01'),
(41, NULL, 'O3 - AQI', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"0.2\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"0.1\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:14\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"0.4\"}', '{\"wMin\":\"0\",\"wMax\":\"0.2\"}', '{\"oMin\":\"0\",\"oMax\":\"10\"}', NULL, NULL, NULL, '2', '1', NULL, NULL, '2024-02-14 09:45:33', '2024-02-14 09:45:33'),
(42, NULL, 'O3 - AQI', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"0.2\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"0.1\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:15\"}}', '{\"slaveID\":\"\",\"register\":\"\",\"bitLength\":\"\"}', '{\"cMin\":\"0\",\"cMax\":\"0.4\"}', '{\"wMin\":\"0\",\"wMax\":\"0.2\"}', '{\"oMin\":\"0\",\"oMax\":\"10\"}', NULL, NULL, NULL, '6', '1', NULL, NULL, '2024-02-14 09:47:11', '2024-02-14 09:47:11'),
(43, NULL, 'PB - AQI', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"0.012\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"0.0060\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:17\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"0.024\"}', '{\"wMin\":\"0\",\"wMax\":\"0.012\"}', '{\"oMin\":\"0\",\"oMax\":\"5\"}', NULL, NULL, NULL, '2', '1', NULL, NULL, '2024-02-14 09:49:31', '2024-02-14 09:49:31'),
(44, NULL, 'PB - AQI', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"0.012\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"0.0060\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:19\"}}', '{\"slaveID\":\"\",\"register\":\"\",\"bitLength\":\"\"}', '{\"cMin\":\"0\",\"cMax\":\"0.024\"}', '{\"wMin\":\"0\",\"wMax\":\"0.012\"}', '{\"oMin\":\"0\",\"oMax\":\"5\"}', NULL, NULL, NULL, '6', '1', NULL, NULL, '2024-02-14 09:50:33', '2024-02-14 09:50:33'),
(45, NULL, 'SO2 - AQI', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"10\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"5\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:20\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"20\"}', '{\"wMin\":\"0\",\"wMax\":\"10\"}', '{\"oMin\":\"0\",\"oMax\":\"20\"}', NULL, NULL, NULL, '2', '1', NULL, NULL, '2024-02-14 09:51:37', '2024-02-14 09:51:37'),
(47, NULL, 'analogse', NULL, NULL, NULL, 'UnLatch', 0, NULL, 0, 0, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"4\",\"minRS\":\"20\",\"maxR\":\"0\",\"maxRS\":\"100\"}', '{}', '{}', NULL, '{\"cMin\":\"10\",\"cMax\":\"60\"}', '{\"wMin\":\"20\",\"wMax\":\"80\"}', '{\"oMin\":\"-1\",\"oMax\":\"100\"}', NULL, NULL, NULL, '2', '7', NULL, NULL, '2024-02-21 12:25:18', '2024-02-21 12:25:18'),
(49, NULL, 'TVOC', NULL, NULL, NULL, 'UnLatch', 1, NULL, 0, 0, 1, '{\"deviationForZeroCheck\":\"0\",\"deviationForSpanCheck\":\"19\"}', NULL, NULL, '{}', '{}', NULL, '{\"cMin\":\"10\",\"cMax\":\"40\"}', '{\"wMin\":\"15\",\"wMax\":\"30\"}', '{\"oMin\":\"0\",\"oMax\":\"100\"}', NULL, NULL, NULL, '4', '1', NULL, NULL, '2024-03-25 11:26:58', '2024-03-25 11:26:58'),
(50, NULL, 'Temperature - T', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 1, '{\"deviationForZeroCheck\":\"0\",\"deviationForSpanCheck\":\"24\"}', NULL, NULL, '{\"stelLimit\":\"100\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"50\",\"twaDuration\":\"10\",\"twaStartTime\":\"15:10\"}}', NULL, '{\"cMin\":\"10\",\"cMax\":\"60\"}', '{\"wMin\":\"15\",\"wMax\":\"80\"}', '{\"oMin\":\"-1\",\"oMax\":\"100\"}', NULL, NULL, NULL, '4', '7', NULL, NULL, '2024-03-27 06:13:21', '2024-03-27 06:13:21'),
(51, NULL, 'Humidity-T', NULL, NULL, NULL, 'Latch', 0, NULL, 0, 0, 0, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"minR\":\"4\",\"minRS\":\"20\",\"maxR\":\"25\",\"maxRS\":\"100\"}', '{}', '{}', NULL, '{\"cMin\":\"10\",\"cMax\":\"60\"}', '{\"wMin\":\"20\",\"wMax\":\"80\"}', '{\"oMin\":\"-1\",\"oMax\":\"100\"}', NULL, NULL, NULL, '2', '7', NULL, NULL, '2024-03-27 06:16:53', '2024-03-27 06:16:53'),
(52, NULL, 'TVOC - T', NULL, NULL, NULL, 'Latch', 0, NULL, 1, 1, 0, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"100\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"S1\",\"twaLimit\":\"50\",\"twaDuration\":\"480\",\"twaStartTime\":\"08:30\"}}', '{\"slaveID\":\"\",\"register\":\"\",\"bitLength\":\"\"}', '{\"cMin\":\"0\",\"cMax\":\"100\"}', '{\"wMin\":\"0\",\"wMax\":\"200\"}', '{\"oMin\":0,\"oMax\":\"600\"}', NULL, NULL, NULL, '6', '1', NULL, NULL, '2024-03-27 06:22:13', '2024-03-27 06:22:13'),
(53, NULL, 'NO2-T', NULL, NULL, NULL, 'Latch', 0, NULL, 0, 0, 0, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, NULL, '{}', '{}', NULL, '{\"cMin\":0,\"cMax\":\"20\"}', '{\"wMin\":0,\"wMax\":\"40\"}', '{\"oMin\":0,\"oMax\":\"100\"}', NULL, NULL, NULL, '4', '1', NULL, NULL, '2024-03-27 06:26:05', '2024-03-27 06:26:05'),
(54, NULL, 'Methane', NULL, NULL, NULL, 'Latch', 0, NULL, 0, 0, 0, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, NULL, '{}', '{}', NULL, '{\"cMin\":\"10\",\"cMax\":\"60\"}', '{\"wMin\":\"15\",\"wMax\":\"80\"}', '{\"oMin\":\"-1\",\"oMax\":\"100\"}', NULL, NULL, NULL, '4', '1', NULL, NULL, '2024-03-28 09:49:36', '2024-03-28 09:49:36'),
(55, NULL, 'CO2', NULL, NULL, NULL, 'Latch', 0, NULL, 0, 0, 0, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, NULL, '{}', '{}', NULL, '{\"cMin\":\"10\",\"cMax\":\"60\"}', '{\"wMin\":\"15\",\"wMax\":\"80\"}', '{\"oMin\":\"-1\",\"oMax\":\"100\"}', NULL, NULL, NULL, '4', '1', NULL, NULL, '2024-03-28 09:50:08', '2024-03-28 09:50:08'),
(56, NULL, 'pH', NULL, NULL, NULL, 'Latch', 0, NULL, 0, 0, 0, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, NULL, '{}', '{}', NULL, '{\"cMin\":\"10\",\"cMax\":\"60\"}', '{\"wMin\":\"15\",\"wMax\":\"80\"}', '{\"oMin\":\"-1\",\"oMax\":\"100\"}', NULL, NULL, NULL, '4', '1', NULL, NULL, '2024-03-28 09:50:30', '2024-03-28 09:50:30'),
(57, NULL, 'NH3', NULL, NULL, NULL, 'Latch', 0, NULL, 0, 0, 0, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, NULL, '{}', '{}', NULL, '{\"cMin\":\"10\",\"cMax\":\"60\"}', '{\"wMin\":\"15\",\"wMax\":\"80\"}', '{\"oMin\":\"-1\",\"oMax\":\"100\"}', NULL, NULL, NULL, '4', '3', NULL, NULL, '2024-03-28 09:51:20', '2024-03-28 09:51:20');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `transactionID` varchar(255) DEFAULT NULL,
  `customerID` varchar(255) DEFAULT NULL,
  `deviceID` varchar(255) DEFAULT NULL,
  `deviceName` text,
  `cardReaderName` varchar(255) DEFAULT NULL,
  `userID` varchar(255) DEFAULT NULL,
  `paymentGatewayID` varchar(255) DEFAULT NULL,
  `chanID` varchar(255) DEFAULT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `amount` varchar(255) DEFAULT NULL,
  `currencyCode` varchar(255) DEFAULT NULL,
  `transactionType` varchar(255) DEFAULT NULL,
  `cardEntryType` varchar(255) DEFAULT NULL,
  `cardType` varchar(255) DEFAULT NULL,
  `maskedPan` varchar(255) DEFAULT NULL,
  `oarData` varchar(255) DEFAULT NULL,
  `ps2000Data` varchar(255) DEFAULT NULL,
  `isFallback` varchar(255) DEFAULT NULL,
  `transactionDate` varchar(255) DEFAULT NULL,
  `cardScheme` varchar(255) DEFAULT NULL,
  `creditSurchargeStatus` varchar(255) DEFAULT NULL,
  `expDate` varchar(255) DEFAULT NULL,
  `result` varchar(255) DEFAULT NULL,
  `transactionJson` text,
  `payloadJson` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `transactionID`, `customerID`, `deviceID`, `deviceName`, `cardReaderName`, `userID`, `paymentGatewayID`, `chanID`, `firstName`, `lastName`, `amount`, `currencyCode`, `transactionType`, `cardEntryType`, `cardType`, `maskedPan`, `oarData`, `ps2000Data`, `isFallback`, `transactionDate`, `cardScheme`, `creditSurchargeStatus`, `expDate`, `result`, `transactionJson`, `payloadJson`, `createdAt`, `updatedAt`) VALUES
(1, '82d59c0d-43d3-47b0-9318-67c0efce8171', 'cd7db52f-af90-448a-ab3d-5e1948948d81', '104', NULL, 'L3000-18967028', NULL, '9b598e5a-4c79-4883-b0ca-a51055536355', '82d59c0d-43d3-47b0-9318-67c0efce8171', NULL, NULL, '11000', 'CAD', 'SALE', 'EMV_PROXIMITY', 'DEBIT', '************0003', NULL, NULL, '0', NULL, 'INTERAC', 'NOT_APPLIED', NULL, 'APPROVED', '{\"date\":\"Thu Aug 29 11:06:56 IST 2024\",\"amountAuthorized\":{\"value\":11000,\"currencyCode\":\"CAD\"},\"lastName\":null,\"iccArc\":\"00\",\"cardScheme\":\"INTERAC\",\"creditSurchargeStatus\":\"NOT_APPLIED\",\"avsResponseCode\":\"UNSET\",\"iccAtc\":\"0010\",\"iccIad\":\"1502850440F920600000B0100000D087000001000000\",\"iccAppName\":\"Interac\",\"gratuityAmount\":{\"value\":0,\"currencyCode\":\"CAD\"},\"iccTsi\":null,\"result\":\"APPROVED\",\"tenderType\":\"CARD\",\"approved\":\"yes\",\"id\":\"290824O2C-DEFC1F61-E7C0-42FC-BD0B-6F0BFEAD22C1\",\"state\":\"UNKNOWN\",\"amount\":{\"value\":11000,\"currencyCode\":\"CAD\"},\"authCode\":\"444594\",\"maskedPan\":\"************0003\",\"cardType\":\"DEBIT\",\"iccTvr\":\"8000008000\",\"tax\":{\"value\":0,\"currencyCode\":\"CAD\"},\"transactionType\":\"SALE\",\"iccCvmr\":\"UNKNOWN\",\"firstName\":null,\"iccCsn\":\"01\",\"iccMode\":\"ICC_MODE\",\"isFallback\":false,\"accountBalance\":{\"value\":0,\"currencyCode\":\"CAD\"},\"iccAc\":\"1878AC29B0EFC8A3\",\"cardEntryType\":\"EMV_PROXIMITY\",\"iccAid\":\"A0000002771010\",\"errors\":[]}', NULL, '2024-08-29 15:06:48', '2024-08-29 20:37:24'),
(2, '2544ba12-1183-48dd-8660-83cd6f6b3ab5', 'cd7db52f-af90-448a-ab3d-5e1948948d81', '104', NULL, 'L3000-18967028', NULL, 'd7f64cf9-4f1e-474e-81ba-8722048775a5', '2544ba12-1183-48dd-8660-83cd6f6b3ab5', NULL, NULL, '15000', 'CAD', 'SALE', 'MANUALLY_ENTERED', 'CREDIT', '************4111', '010001140308291509070829027344400000000000197469MCC859286', 'MMCC859286      0829E1', '0', NULL, 'MASTERCARD', 'NOT_APPLIED', '1225', 'APPROVED', '{\"date\":\"Thu Aug 29 11:09:07 IST 2024\",\"amountAuthorized\":{\"value\":15000,\"currencyCode\":\"CAD\"},\"cardScheme\":\"MASTERCARD\",\"creditSurchargeStatus\":\"NOT_APPLIED\",\"avsResponseCode\":\"ADDRESS_AND_ZIP_CODE_IN_WRONG_FORMAT\",\"expDate\":\"1225\",\"gratuityAmount\":{\"value\":0,\"currencyCode\":\"CAD\"},\"result\":\"APPROVED\",\"tenderType\":\"CARD\",\"approved\":\"yes\",\"id\":\"290824C44-5C6FAB6A-97E0-4E76-8EA9-D313680DCA26\",\"state\":\"UNKNOWN\",\"amount\":{\"value\":15000,\"currencyCode\":\"CAD\"},\"authCode\":\"197469\",\"maskedPan\":\"************4111\",\"cardType\":\"CREDIT\",\"oarData\":\"010001140308291509070829027344400000000000197469MCC859286\",\"tax\":{\"value\":0,\"currencyCode\":\"CAD\"},\"avsResponse\":\"C\",\"transactionType\":\"SALE\",\"ps2000Data\":\"MMCC859286      0829E1\",\"isFallback\":false,\"accountBalance\":{\"value\":0,\"currencyCode\":\"CAD\"},\"cardEntryType\":\"MANUALLY_ENTERED\",\"errors\":[]}', NULL, '2024-08-29 15:08:31', '2024-08-29 20:39:15'),
(3, '298e8988-eb86-4ee2-abb5-ab8168f9ef40', 'cd7db52f-af90-448a-ab3d-5e1948948d81', '104', NULL, 'L3000-18967028', NULL, 'f47695d0-d85c-4f52-b699-e7f10a75f08d', '298e8988-eb86-4ee2-abb5-ab8168f9ef40', NULL, NULL, '14000', 'CAD', 'SALE', 'MANUALLY_ENTERED', 'CREDIT', '************0011', '010001169708291518340829027344400000000000198204MCC860033', 'MMCC860033      0829', '0', NULL, 'MASTERCARD', 'NOT_APPLIED', '1225', 'APPROVED', '{\"date\":\"Thu Aug 29 11:18:34 IST 2024\",\"amountAuthorized\":{\"value\":14000,\"currencyCode\":\"CAD\"},\"cardScheme\":\"MASTERCARD\",\"creditSurchargeStatus\":\"NOT_APPLIED\",\"avsResponseCode\":\"AVS_NOT_SUPPORTED\",\"expDate\":\"1225\",\"gratuityAmount\":{\"value\":0,\"currencyCode\":\"CAD\"},\"result\":\"APPROVED\",\"tenderType\":\"CARD\",\"approved\":\"yes\",\"id\":\"290824O2D-89B55D7F-D9D1-4B75-8C2F-D2523AD59E28\",\"state\":\"UNKNOWN\",\"amount\":{\"value\":14000,\"currencyCode\":\"CAD\"},\"authCode\":\"198204\",\"maskedPan\":\"************0011\",\"cardType\":\"CREDIT\",\"oarData\":\"010001169708291518340829027344400000000000198204MCC860033\",\"tax\":{\"value\":0,\"currencyCode\":\"CAD\"},\"avsResponse\":\"S\",\"transactionType\":\"SALE\",\"ps2000Data\":\"MMCC860033      0829\",\"isFallback\":false,\"accountBalance\":{\"value\":0,\"currencyCode\":\"CAD\"},\"cardEntryType\":\"MANUALLY_ENTERED\",\"errors\":[]}', NULL, '2024-08-29 15:18:00', '2024-08-29 20:48:43'),
(4, '3c3e93ef-4b7e-493c-9234-eedaa32e342f', 'cd7db52f-af90-448a-ab3d-5e1948948d81', '104', NULL, 'L3000-18967028', NULL, 'a655a470-5672-47b7-9671-a4061d007b5b', '3c3e93ef-4b7e-493c-9234-eedaa32e342f', NULL, NULL, '19000', 'CAD', 'SALE', 'EMV_PROXIMITY', 'CREDIT', '************0043', '010010726708291556090000047554200000000000200477424215107267', 'A7542425736923143314A', '0', NULL, 'VISA', 'NOT_APPLIED', '1224', 'APPROVED', '{\"date\":\"Thu Aug 29 11:56:09 IST 2024\",\"amountAuthorized\":{\"value\":19000,\"currencyCode\":\"CAD\"},\"lastName\":null,\"iccArc\":\"00\",\"cardScheme\":\"VISA\",\"creditSurchargeStatus\":\"NOT_APPLIED\",\"avsResponseCode\":\"UNSET\",\"iccAtc\":\"0020\",\"iccIad\":\"06010A03A00000\",\"expDate\":\"1224\",\"iccAppName\":\"VISA CREDIT\",\"gratuityAmount\":{\"value\":0,\"currencyCode\":\"CAD\"},\"iccTsi\":null,\"result\":\"APPROVED\",\"tenderType\":\"CARD\",\"approved\":\"yes\",\"id\":\"290824O2C-01625D0F-E514-48AD-8E9C-850C672AC051\",\"state\":\"UNKNOWN\",\"amount\":{\"value\":19000,\"currencyCode\":\"CAD\"},\"authCode\":\"200477\",\"maskedPan\":\"************0043\",\"cardType\":\"CREDIT\",\"iccTvr\":\"0000000000\",\"oarData\":\"010010726708291556090000047554200000000000200477424215107267\",\"tax\":{\"value\":0,\"currencyCode\":\"CAD\"},\"transactionType\":\"SALE\",\"iccCvmr\":\"UNKNOWN\",\"firstName\":null,\"iccCsn\":\"01\",\"ps2000Data\":\"A7542425736923143314A\",\"iccMode\":\"ICC_MODE\",\"isFallback\":false,\"accountBalance\":{\"value\":0,\"currencyCode\":\"CAD\"},\"iccAc\":\"2249C96BC44A858B\",\"cardEntryType\":\"EMV_PROXIMITY\",\"iccAid\":\"A0000000031010\",\"errors\":[]}', NULL, '2024-08-29 15:55:52', '2024-08-29 21:26:17'),
(5, '0f1fa6b9-ecbe-449a-b39b-3635c8f597ce', 'cd7db52f-af90-448a-ab3d-5e1948948d81', '104', NULL, 'L3000-18967028', NULL, '40804f33-d7a3-4c33-9688-631ca3da1f74', '0f1fa6b9-ecbe-449a-b39b-3635c8f597ce', NULL, NULL, '16000', 'CAD', 'SALE', 'MANUALLY_ENTERED', 'CREDIT', '************0003', NULL, NULL, '0', NULL, 'INTERAC', 'NOT_APPLIED', '1228', 'INVALID_CARD', '{\"date\":\"Thu Aug 29 14:12:14 IST 2024\",\"amount\":{\"value\":16000,\"currencyCode\":\"CAD\"},\"maskedPan\":\"************0003\",\"cardScheme\":\"INTERAC\",\"creditSurchargeStatus\":\"NOT_APPLIED\",\"cardType\":\"CREDIT\",\"avsResponseCode\":\"UNSET\",\"tax\":{\"value\":0,\"currencyCode\":\"CAD\"},\"avsResponse\":null,\"expDate\":\"1228\",\"gratuityAmount\":{\"value\":0,\"currencyCode\":\"CAD\"},\"transactionType\":\"SALE\",\"result\":\"INVALID_CARD\",\"tenderType\":\"CARD\",\"approved\":\"no\",\"id\":\"290824O2D-F17984E9-5948-45E4-8D48-774F4D173BAF\",\"isFallback\":false,\"state\":\"UNKNOWN\",\"accountBalance\":{\"value\":0,\"currencyCode\":\"CAD\"},\"cardEntryType\":\"MANUALLY_ENTERED\",\"errors\":[]}', NULL, '2024-08-29 18:11:36', '2024-08-29 23:52:20'),
(6, '3ee11303-9cee-4466-b1b9-85bc345f465e', 'cd7db52f-af90-448a-ab3d-5e1948948d81', '104', NULL, 'L3000-18967028', NULL, 'd962d837-8a66-4fd8-a271-de6efa6e92c5', '3ee11303-9cee-4466-b1b9-85bc345f465e', NULL, NULL, '5000', 'CAD', 'SALE', 'EMV_PROXIMITY', 'CREDIT', '************4111', '010001968809040448580904027344400000000000317564MCC973371', 'MMCC973371      0904', '0', NULL, 'MASTERCARD', 'NOT_APPLIED', '1225', 'APPROVED', '{\"date\":\"Wed Sep 04 00:48:58 IST 2024\",\"amountAuthorized\":{\"value\":5000,\"currencyCode\":\"CAD\"},\"lastName\":null,\"iccArc\":\"00\",\"cardScheme\":\"MASTERCARD\",\"creditSurchargeStatus\":\"NOT_APPLIED\",\"avsResponseCode\":\"UNSET\",\"iccAtc\":\"0002\",\"iccIad\":\"0111A04003220000000000000000000000FF\",\"expDate\":\"1225\",\"iccAppName\":\"Mastercard\",\"gratuityAmount\":{\"value\":0,\"currencyCode\":\"CAD\"},\"iccTsi\":null,\"result\":\"APPROVED\",\"tenderType\":\"CARD\",\"approved\":\"yes\",\"id\":\"040924O2D-72632CAE-3F24-4182-95BC-949B3ABB5308\",\"state\":\"UNKNOWN\",\"amount\":{\"value\":5000,\"currencyCode\":\"CAD\"},\"authCode\":\"317564\",\"maskedPan\":\"************4111\",\"cardType\":\"CREDIT\",\"iccTvr\":\"0000008001\",\"oarData\":\"010001968809040448580904027344400000000000317564MCC973371\",\"tax\":{\"value\":0,\"currencyCode\":\"CAD\"},\"transactionType\":\"SALE\",\"iccCvmr\":\"NO_CVM_REQUIRED\",\"firstName\":null,\"iccCsn\":\"01\",\"ps2000Data\":\"MMCC973371      0904\",\"iccMode\":\"ICC_MODE\",\"isFallback\":false,\"accountBalance\":{\"value\":0,\"currencyCode\":\"CAD\"},\"iccAc\":\"782DE5FAF60E8C5E\",\"cardEntryType\":\"EMV_PROXIMITY\",\"iccAid\":\"A0000000041010\",\"errors\":[]}', NULL, '2024-09-04 04:48:50', '2024-09-04 10:19:05'),
(7, 'f5c7009e-e850-4527-b13a-dec0d3357cf1', 'cd7db52f-af90-448a-ab3d-5e1948948d81', '104', NULL, 'L3000-18967028', NULL, '92189866-ae89-42f7-ad19-357eed48ce75', 'f5c7009e-e850-4527-b13a-dec0d3357cf1', NULL, NULL, '10000', 'CAD', 'SALE', 'EMV_PROXIMITY', 'CREDIT', '************4111', '010001970909040457170904027344400000000000317622MCC973430', 'MMCC973430      0904', '0', NULL, 'MASTERCARD', 'NOT_APPLIED', '1225', 'APPROVED', '{\"date\":\"Wed Sep 04 00:57:17 IST 2024\",\"amountAuthorized\":{\"value\":10000,\"currencyCode\":\"CAD\"},\"lastName\":null,\"iccArc\":\"00\",\"cardScheme\":\"MASTERCARD\",\"creditSurchargeStatus\":\"NOT_APPLIED\",\"avsResponseCode\":\"UNSET\",\"iccAtc\":\"0003\",\"iccIad\":\"0111A04003220000000000000000000000FF\",\"expDate\":\"1225\",\"iccAppName\":\"Mastercard\",\"gratuityAmount\":{\"value\":0,\"currencyCode\":\"CAD\"},\"iccTsi\":null,\"result\":\"APPROVED\",\"tenderType\":\"CARD\",\"approved\":\"yes\",\"id\":\"040924C44-50A1FE1F-0AB4-4E7E-A243-F49B9FC24928\",\"state\":\"UNKNOWN\",\"amount\":{\"value\":10000,\"currencyCode\":\"CAD\"},\"authCode\":\"317622\",\"maskedPan\":\"************4111\",\"cardType\":\"CREDIT\",\"iccTvr\":\"0000008001\",\"oarData\":\"010001970909040457170904027344400000000000317622MCC973430\",\"tax\":{\"value\":0,\"currencyCode\":\"CAD\"},\"transactionType\":\"SALE\",\"iccCvmr\":\"NO_CVM_REQUIRED\",\"firstName\":null,\"iccCsn\":\"01\",\"ps2000Data\":\"MMCC973430      0904\",\"iccMode\":\"ICC_MODE\",\"isFallback\":false,\"accountBalance\":{\"value\":0,\"currencyCode\":\"CAD\"},\"iccAc\":\"EC4295D80E64769D\",\"cardEntryType\":\"EMV_PROXIMITY\",\"iccAid\":\"A0000000041010\",\"errors\":[]}', NULL, '2024-09-04 04:57:10', '2024-09-04 10:27:21'),
(8, '07e49ee7-72cd-426b-99cd-0600e5345d95', 'cd7db52f-af90-448a-ab3d-5e1948948d81', '104', NULL, 'L3000-18967028', NULL, 'a0b66b74-0213-4439-a7e9-8b7ebe982f86', '07e49ee7-72cd-426b-99cd-0600e5345d95', NULL, NULL, '3000', 'CAD', 'SALE', 'EMV_PROXIMITY', 'CREDIT', '************0043', '010012619109050554280000047554200000000000345478424905126191', 'A7542492126890193314A', '0', NULL, 'VISA', 'NOT_APPLIED', '1224', 'APPROVED', '{\"date\":\"Thu Sep 05 01:54:28 IST 2024\",\"amountAuthorized\":{\"value\":3000,\"currencyCode\":\"CAD\"},\"lastName\":null,\"iccArc\":\"00\",\"cardScheme\":\"VISA\",\"creditSurchargeStatus\":\"NOT_APPLIED\",\"avsResponseCode\":\"UNSET\",\"iccAtc\":\"0021\",\"iccIad\":\"06010A03A00000\",\"expDate\":\"1224\",\"iccAppName\":\"VISA CREDIT\",\"gratuityAmount\":{\"value\":0,\"currencyCode\":\"CAD\"},\"iccTsi\":null,\"result\":\"APPROVED\",\"tenderType\":\"CARD\",\"approved\":\"yes\",\"id\":\"050924O2D-79EB7B93-5100-4E7D-B45E-81CA3596D5F8\",\"state\":\"UNKNOWN\",\"amount\":{\"value\":3000,\"currencyCode\":\"CAD\"},\"authCode\":\"345478\",\"maskedPan\":\"************0043\",\"cardType\":\"CREDIT\",\"iccTvr\":\"0000000000\",\"oarData\":\"010012619109050554280000047554200000000000345478424905126191\",\"tax\":{\"value\":0,\"currencyCode\":\"CAD\"},\"transactionType\":\"SALE\",\"iccCvmr\":\"UNKNOWN\",\"firstName\":null,\"iccCsn\":\"01\",\"ps2000Data\":\"A7542492126890193314A\",\"iccMode\":\"ICC_MODE\",\"isFallback\":false,\"accountBalance\":{\"value\":0,\"currencyCode\":\"CAD\"},\"iccAc\":\"5F837A4997C483DB\",\"cardEntryType\":\"EMV_PROXIMITY\",\"iccAid\":\"A0000000031010\",\"errors\":[]}', NULL, '2024-09-05 05:53:53', '2024-09-05 11:24:31'),
(9, '2197dcfd-78af-4d36-8b54-4581fa48b99b', 'cd7db52f-af90-448a-ab3d-5e1948948d81', '104', NULL, 'L3000-18967028', NULL, 'caedbdc9-bd2a-45ae-bd32-16fc612d8a45', '2197dcfd-78af-4d36-8b54-4581fa48b99b', 'Test Card 03', 'UAT CAN', '5000', 'CAD', 'SALE', 'EMV_CONTACT', 'CREDIT', '************0243', '010012639609050608100000047554200000000000345814424906126396', 'A7542492209193360051A', '0', NULL, 'VISA', 'NOT_APPLIED', '1224', 'APPROVED', '{\"date\":\"Thu Sep 05 02:08:10 IST 2024\",\"amountAuthorized\":{\"value\":5000,\"currencyCode\":\"CAD\"},\"lastName\":\"UAT CAN\",\"iccArc\":\"00\",\"cardScheme\":\"VISA\",\"creditSurchargeStatus\":\"NOT_APPLIED\",\"avsResponseCode\":\"UNSET\",\"iccAtc\":\"0002\",\"iccIad\":\"06010A03A02000\",\"expDate\":\"1224\",\"iccAppName\":\"Visa Credit\",\"gratuityAmount\":{\"value\":0,\"currencyCode\":\"CAD\"},\"iccTsi\":\"7800\",\"result\":\"APPROVED\",\"tenderType\":\"CARD\",\"approved\":\"yes\",\"id\":\"050924C45-F3996EAC-52A1-4251-9315-64E007EB5BF2\",\"state\":\"UNKNOWN\",\"amount\":{\"value\":5000,\"currencyCode\":\"CAD\"},\"authCode\":\"345814\",\"maskedPan\":\"************0243\",\"cardType\":\"CREDIT\",\"iccTvr\":\"8000008000\",\"oarData\":\"010012639609050608100000047554200000000000345814424906126396\",\"tax\":{\"value\":0,\"currencyCode\":\"CAD\"},\"transactionType\":\"SALE\",\"iccCvmr\":\"NO_CVM_REQUIRED\",\"firstName\":\"Test Card 03\",\"iccCsn\":\"01\",\"ps2000Data\":\"A7542492209193360051A\",\"iccMode\":\"ICC_MODE\",\"isFallback\":false,\"accountBalance\":{\"value\":0,\"currencyCode\":\"CAD\"},\"iccAc\":\"62547069D373B1E5\",\"cardEntryType\":\"EMV_CONTACT\",\"iccAid\":\"A0000000031010\",\"errors\":[]}', NULL, '2024-09-05 06:06:10', '2024-09-05 11:38:18'),
(10, '696e3fb1-dcba-4577-9481-339f9f0bc029', 'cd7db52f-af90-448a-ab3d-5e1948948d81', '104', NULL, 'L3000-18967028', NULL, 'c54fff04-2777-49ce-90fa-ff4416df89fc', '696e3fb1-dcba-4577-9481-339f9f0bc029', NULL, NULL, '3000', 'CAD', 'SALE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-05 07:25:28', 'PENDING', NULL, NULL, '2024-09-05 07:25:28', '2024-09-05 12:55:28'),
(11, 'e8b63258-251b-4105-ad20-db8dd16e92ba', 'cd7db52f-af90-448a-ab3d-5e1948948d81', '104', NULL, 'L3000-18967028', NULL, 'f9089104-9569-4d31-b166-e55e2c0d7879', 'e8b63258-251b-4105-ad20-db8dd16e92ba', NULL, NULL, '1000', 'CAD', 'SALE', 'EMV_PROXIMITY', 'CREDIT', '************0844', '010001053709050808360000062005900000610025348576424908010537', 'D90504083710164005', '0', NULL, 'DISCOVER', 'NOT_APPLIED', '0526', 'APPROVED', '{\"date\":\"Thu Sep 05 04:08:36 IST 2024\",\"amountAuthorized\":{\"value\":1000,\"currencyCode\":\"CAD\"},\"lastName\":null,\"iccArc\":\"00\",\"cardScheme\":\"DISCOVER\",\"creditSurchargeStatus\":\"NOT_APPLIED\",\"avsResponseCode\":\"UNSET\",\"iccAtc\":\"0018\",\"iccIad\":\"01152088004000009800\",\"expDate\":\"0526\",\"iccAppName\":\"Discover CL\",\"gratuityAmount\":{\"value\":0,\"currencyCode\":\"CAD\"},\"iccTsi\":\"0800\",\"result\":\"APPROVED\",\"tenderType\":\"CARD\",\"approved\":\"yes\",\"id\":\"050924O2D-39E6B602-A18C-4901-8150-70A05B19A810\",\"state\":\"UNKNOWN\",\"amount\":{\"value\":1000,\"currencyCode\":\"CAD\"},\"authCode\":\"348576\",\"maskedPan\":\"************0844\",\"cardType\":\"CREDIT\",\"iccTvr\":\"8000008000\",\"oarData\":\"010001053709050808360000062005900000610025348576424908010537\",\"tax\":{\"value\":0,\"currencyCode\":\"CAD\"},\"transactionType\":\"SALE\",\"iccCvmr\":\"UNKNOWN\",\"firstName\":null,\"iccCsn\":\"01\",\"ps2000Data\":\"D90504083710164005\",\"iccMode\":\"ICC_MODE\",\"isFallback\":false,\"accountBalance\":{\"value\":0,\"currencyCode\":\"CAD\"},\"iccAc\":\"5A830DF06C1864E0\",\"cardEntryType\":\"EMV_PROXIMITY\",\"iccAid\":\"A0000001523010\",\"errors\":[]}', NULL, '2024-09-05 08:07:27', '2024-09-05 13:38:42'),
(12, 'c7e9d81d-77b0-40cb-abb9-c6f88d423906', 'cd7db52f-af90-448a-ab3d-5e1948948d81', '104', NULL, 'L3000-18967028', NULL, 'f9089104-9569-4d31-b166-e55e2c0d7879', 'c7e9d81d-77b0-40cb-abb9-c6f88d423906', NULL, NULL, '2000', 'CAD', 'SALE', 'EMV_PROXIMITY', 'CREDIT', '************0844', '010001054209050818170000062005900000610025349067424908010542', 'D90504181710181205', '0', NULL, 'DISCOVER', 'NOT_APPLIED', '0526', 'APPROVED', '{\"date\":\"Thu Sep 05 04:18:17 IST 2024\",\"amountAuthorized\":{\"value\":2000,\"currencyCode\":\"CAD\"},\"lastName\":null,\"iccArc\":\"00\",\"cardScheme\":\"DISCOVER\",\"creditSurchargeStatus\":\"NOT_APPLIED\",\"avsResponseCode\":\"UNSET\",\"iccAtc\":\"0019\",\"iccIad\":\"01152088000000009800\",\"expDate\":\"0526\",\"iccAppName\":\"Discover CL\",\"gratuityAmount\":{\"value\":0,\"currencyCode\":\"CAD\"},\"iccTsi\":\"0800\",\"result\":\"APPROVED\",\"tenderType\":\"CARD\",\"approved\":\"yes\",\"id\":\"050924O2C-1A27F2F3-6FC6-4DBB-8C8B-5457193EFEAE\",\"state\":\"UNKNOWN\",\"amount\":{\"value\":2000,\"currencyCode\":\"CAD\"},\"authCode\":\"349067\",\"maskedPan\":\"************0844\",\"cardType\":\"CREDIT\",\"iccTvr\":\"8000008000\",\"oarData\":\"010001054209050818170000062005900000610025349067424908010542\",\"tax\":{\"value\":0,\"currencyCode\":\"CAD\"},\"transactionType\":\"SALE\",\"iccCvmr\":\"UNKNOWN\",\"firstName\":null,\"iccCsn\":\"01\",\"ps2000Data\":\"D90504181710181205\",\"iccMode\":\"ICC_MODE\",\"isFallback\":false,\"accountBalance\":{\"value\":0,\"currencyCode\":\"CAD\"},\"iccAc\":\"5A15F14F14CD5E7D\",\"cardEntryType\":\"EMV_PROXIMITY\",\"iccAid\":\"A0000001523010\",\"errors\":[]}', NULL, '2024-09-05 08:17:58', '2024-09-05 13:48:22'),
(13, '050924C45-DD0594C2-1471-4F20-805F-9387A501F631', 'cd7db52f-af90-448a-ab3d-5e1948948d81', '104', NULL, 'L3000-18967028', NULL, 'd3eee724-29a7-437a-ae3f-918609caa0cf', 'a0a3fb71-a1be-4bb6-a42a-9f2a02b9dc1d', NULL, NULL, '1000', 'CAD', 'SALE', 'EMV_PROXIMITY', 'CREDIT', '************0844', '010001054309050824190000062005900000610025349196424908010543', 'D90504241910186205', '0', NULL, 'DISCOVER', 'NOT_APPLIED', '0526', 'APPROVED', '{\"date\":\"Thu Sep 05 04:24:19 IST 2024\",\"amountAuthorized\":{\"value\":1000,\"currencyCode\":\"CAD\"},\"lastName\":null,\"iccArc\":\"00\",\"cardScheme\":\"DISCOVER\",\"creditSurchargeStatus\":\"NOT_APPLIED\",\"avsResponseCode\":\"UNSET\",\"iccAtc\":\"001A\",\"iccIad\":\"01152088000000009800\",\"expDate\":\"0526\",\"iccAppName\":\"Discover CL\",\"gratuityAmount\":{\"value\":0,\"currencyCode\":\"CAD\"},\"iccTsi\":\"0800\",\"result\":\"APPROVED\",\"tenderType\":\"CARD\",\"approved\":\"yes\",\"id\":\"050924C45-DD0594C2-1471-4F20-805F-9387A501F631\",\"state\":\"UNKNOWN\",\"amount\":{\"value\":1000,\"currencyCode\":\"CAD\"},\"authCode\":\"349196\",\"maskedPan\":\"************0844\",\"cardType\":\"CREDIT\",\"iccTvr\":\"8000008000\",\"oarData\":\"010001054309050824190000062005900000610025349196424908010543\",\"tax\":{\"value\":0,\"currencyCode\":\"CAD\"},\"transactionType\":\"SALE\",\"iccCvmr\":\"UNKNOWN\",\"firstName\":null,\"iccCsn\":\"01\",\"ps2000Data\":\"D90504241910186205\",\"iccMode\":\"ICC_MODE\",\"isFallback\":false,\"accountBalance\":{\"value\":0,\"currencyCode\":\"CAD\"},\"iccAc\":\"40BD82D6AD352475\",\"cardEntryType\":\"EMV_PROXIMITY\",\"iccAid\":\"A0000001523010\",\"errors\":[]}', NULL, '2024-09-05 08:24:13', '2024-09-05 13:54:28'),
(14, '050924C44-5742E1E5-482C-4B16-A756-9B5EC19B1C9F', 'cd7db52f-af90-448a-ab3d-5e1948948d81', '104', NULL, 'L3000-18967028', NULL, '6601dc8c-2683-4593-a769-c2119fa275a5', '5a33a44e-ef38-4999-b7b3-f46473181c86', NULL, NULL, '20000', 'CAD', 'SALE', 'EMV_PROXIMITY', 'CREDIT', '************0844', '010001055409050919140000062005900000610025349812424909010554', 'D90505191410245405', '0', NULL, 'DISCOVER', 'NOT_APPLIED', '0526', 'APPROVED', '{\"date\":\"Thu Sep 05 05:19:14 IST 2024\",\"amountAuthorized\":{\"value\":20000,\"currencyCode\":\"CAD\"},\"lastName\":null,\"iccArc\":\"00\",\"cardScheme\":\"DISCOVER\",\"creditSurchargeStatus\":\"NOT_APPLIED\",\"avsResponseCode\":\"UNSET\",\"iccAtc\":\"001B\",\"iccIad\":\"01152088800000009800\",\"expDate\":\"0526\",\"iccAppName\":\"Discover CL\",\"gratuityAmount\":{\"value\":0,\"currencyCode\":\"CAD\"},\"iccTsi\":\"4800\",\"result\":\"APPROVED\",\"tenderType\":\"CARD\",\"approved\":\"yes\",\"id\":\"050924C44-5742E1E5-482C-4B16-A756-9B5EC19B1C9F\",\"state\":\"UNKNOWN\",\"amount\":{\"value\":20000,\"currencyCode\":\"CAD\"},\"authCode\":\"349812\",\"maskedPan\":\"************0844\",\"cardType\":\"CREDIT\",\"iccTvr\":\"8000008000\",\"oarData\":\"010001055409050919140000062005900000610025349812424909010554\",\"tax\":{\"value\":0,\"currencyCode\":\"CAD\"},\"transactionType\":\"SALE\",\"iccCvmr\":\"UNKNOWN\",\"firstName\":null,\"iccCsn\":\"01\",\"ps2000Data\":\"D90505191410245405\",\"iccMode\":\"ICC_MODE\",\"isFallback\":false,\"accountBalance\":{\"value\":0,\"currencyCode\":\"CAD\"},\"iccAc\":\"869650DFD41F3E8A\",\"cardEntryType\":\"EMV_PROXIMITY\",\"iccAid\":\"A0000001523010\",\"errors\":[\"ECLCommerceError ECLTransactionSignatureCancelled\"]}', NULL, '2024-09-05 09:19:09', '2024-09-05 14:49:20');

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `id` int NOT NULL,
  `unitLabel` varchar(255) NOT NULL,
  `unitMeasure` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `userLogs`
--

CREATE TABLE `userLogs` (
  `id` int UNSIGNED NOT NULL,
  `userId` int DEFAULT NULL,
  `userEmail` varchar(125) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `locationID` int DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `facilityID` int DEFAULT NULL,
  `buildingID` int DEFAULT NULL,
  `floorID` int DEFAULT NULL,
  `zoneID` int DEFAULT NULL,
  `companyCode` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobileNumber` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employeeID` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyCode` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `locationID` int UNSIGNED DEFAULT NULL,
  `branchID` int UNSIGNED DEFAULT NULL,
  `facilityID` int UNSIGNED DEFAULT NULL,
  `buildingID` int UNSIGNED DEFAULT NULL,
  `floorID` int UNSIGNED DEFAULT NULL,
  `zoneID` int UNSIGNED DEFAULT NULL,
  `userRole` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `changePassword` tinyint(1) NOT NULL DEFAULT '1',
  `secLevelAuth` int NOT NULL DEFAULT '1',
  `otpNumber` int NOT NULL DEFAULT '0',
  `otpGeneratedAt` timestamp NULL DEFAULT NULL,
  `isVerified` tinyint(1) NOT NULL DEFAULT '0',
  `loginFailAttempt` int NOT NULL DEFAULT '0',
  `blocked` tinyint(1) NOT NULL DEFAULT '0',
  `emailVerifiedAt` timestamp NULL DEFAULT NULL,
  `password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rememberToken` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imageInfo` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `empNotification` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastLoginActivity` timestamp NULL DEFAULT NULL,
  `lastAcknowledgedAlert` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '22-4-2023 11:12:49',
  `notificationId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '0',
  `notificationTimestamp` timestamp NULL DEFAULT NULL,
  `deviceDetails` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emailNotification` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'INSTANT',
  `smsNotification` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'NONE',
  `recordedTimestamp` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `mobileNumber`, `employeeID`, `companyCode`, `locationID`, `branchID`, `facilityID`, `buildingID`, `floorID`, `zoneID`, `userRole`, `changePassword`, `secLevelAuth`, `otpNumber`, `otpGeneratedAt`, `isVerified`, `loginFailAttempt`, `blocked`, `emailVerifiedAt`, `password`, `rememberToken`, `imageInfo`, `empNotification`, `createdAt`, `modifiedAt`, `lastLoginActivity`, `lastAcknowledgedAlert`, `notificationId`, `notificationTimestamp`, `deviceDetails`, `emailNotification`, `smsNotification`, `recordedTimestamp`) VALUES
(315, 'System Specialist', 'admin@dabadu.com', '09884466476', '14', 'KW', NULL, NULL, NULL, NULL, NULL, NULL, 'systemSpecialist', 0, 0, 1514, '2023-08-12 13:08:32', 1, 0, 0, NULL, '$2y$12$RlSOyrzRp9DWIRlaRuzZf.WpN6yMeRUJ5HapsBynmvFzuUk0MvwD6', NULL, '{\"logo\":\"company/KW/logo.svg\", \"loginPageImage\":\"company/KW/image.png\", \"companyName\": \"Dabadu\"}', 1, '2023-08-12 13:06:39', '2024-09-08 10:49:33', '2023-12-19 06:17:37', '13-12-2023 11:19:51', '', NULL, NULL, 'INSTANT', 'NONE', NULL),
(343, 'Anandan Govindarajan 1', 'anandang.it@gmail.com', '9003259729', '15', 'KW', NULL, NULL, NULL, NULL, NULL, NULL, 'User', 0, 0, 0, NULL, 1, 0, 0, NULL, '$2y$12$A1OKk.tUzB87fJn82/OGjevkSpNWicvpbA18RbfrBvbE0UavTfuXS', NULL, NULL, 1, NULL, '2024-09-08 10:46:55', NULL, '22-4-2023 11:12:49', '0', NULL, NULL, 'INSTANT_DAILY', 'NONE', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `zones`
--

CREATE TABLE `zones` (
  `id` int NOT NULL,
  `locationID` int DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `facilityID` int DEFAULT NULL,
  `buildingID` int DEFAULT NULL,
  `floorID` int DEFAULT NULL,
  `zoneName` varchar(128) DEFAULT NULL,
  `coordinates` varchar(64) DEFAULT NULL,
  `info` text,
  `image` varchar(256) DEFAULT NULL,
  `parentID` int DEFAULT NULL,
  `isAQI` tinyint(1) DEFAULT NULL,
  `zoneHooterStatus` varchar(64) DEFAULT NULL,
  `aqiValue` decimal(11,3) DEFAULT NULL,
  `emailInstant` text,
  `smsInstant` text,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `zones`
--

INSERT INTO `zones` (`id`, `locationID`, `branchID`, `facilityID`, `buildingID`, `floorID`, `zoneName`, `coordinates`, `info`, `image`, `parentID`, `isAQI`, `zoneHooterStatus`, `aqiValue`, `emailInstant`, `smsInstant`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 1, 1, 1, 'CNC and Welding Area', NULL, NULL, 'building/floor_plan.jpeg', NULL, 1, '0', 209.000, 'madhankumar05072000@gmail.com,lanandan.tn@gmail.com,madhantocontact@gmail.com,merlionzing@gmail.com,anandang.it@gmail.com,captainjung55@gmail.com,19eca61@karpagamtech.ac.in,anandang@gmail.com', '9003259719', '2023-12-14 05:02:13', '2024-04-06 06:15:02'),
(2, 1, 1, 1, 1, 1, 'PT & PC Zone', NULL, NULL, 'building/floor_plan.jpeg', NULL, 0, '0', NULL, 'madhankumar05072000@gmail.com,lanandan.tn@gmail.com,madhantocontact@gmail.com,merlionzing@gmail.com,anandang.it@gmail.com,captainjung55@gmail.com,19eca61@karpagamtech.ac.in,anandang@gmail.com', '9003259719', '2023-12-14 05:02:13', '2024-04-05 03:58:13'),
(3, 1, 1, 1, 1, 1, 'Assembly Zone', NULL, NULL, 'building/floor_plan.jpeg', NULL, 0, '0', NULL, 'madhankumar05072000@gmail.com,lanandan.tn@gmail.com,madhantocontact@gmail.com,merlionzing@gmail.com,anandang.it@gmail.com,captainjung55@gmail.com,19eca61@karpagamtech.ac.in,anandang@gmail.com', '9003259719', '2023-12-14 05:02:13', '2024-04-05 03:58:13'),
(4, 1, 1, 1, 1, 2, 'Office Zone', NULL, NULL, 'building/floor_plan.jpeg', NULL, 0, '0', NULL, 'madhankumar05072000@gmail.com,lanandan.tn@gmail.com,madhantocontact@gmail.com,merlionzing@gmail.com,anandang.it@gmail.com,captainjung55@gmail.com,19eca61@karpagamtech.ac.in,anandang@gmail.com', '9003259719', '2023-12-14 05:02:13', '2024-04-05 03:58:13'),
(5, 1, 1, 1, 1, 3, 'Outdoor Zone', NULL, NULL, 'building/floor_plan.jpeg', NULL, 1, '0', NULL, 'madhankumar05072000@gmail.com,lanandan.tn@gmail.com,madhantocontact@gmail.com,merlionzing@gmail.com,anandang.it@gmail.com,captainjung55@gmail.com,19eca61@karpagamtech.ac.in,anandang@gmail.com', '9003259719', '2023-12-14 05:02:13', '2024-04-05 03:58:13'),
(31, 1, 1, 1, 26, 28, 'Sales Zone', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, '2024-04-06 09:03:03', '2024-09-06 09:08:53'),
(32, 1, 1, 1, 26, 29, 'Inner Zone', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, '2024-04-06 09:06:44', '2024-04-06 09:06:44'),
(33, 34, 41, 34, 37, 30, '2', NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, '2024-09-11 14:59:58', '2024-09-11 14:59:58');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applicationVersions`
--
ALTER TABLE `applicationVersions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `aqi`
--
ALTER TABLE `aqi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `buildings`
--
ALTER TABLE `buildings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `communication`
--
ALTER TABLE `communication`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `devices`
--
ALTER TABLE `devices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `emailTextInfo`
--
ALTER TABLE `emailTextInfo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `facilities`
--
ALTER TABLE `facilities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `floors`
--
ALTER TABLE `floors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sensorOutputTypes`
--
ALTER TABLE `sensorOutputTypes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sensors`
--
ALTER TABLE `sensors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sensorsType`
--
ALTER TABLE `sensorsType`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userLogs`
--
ALTER TABLE `userLogs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `zones`
--
ALTER TABLE `zones`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applicationVersions`
--
ALTER TABLE `applicationVersions`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `aqi`
--
ALTER TABLE `aqi`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `buildings`
--
ALTER TABLE `buildings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `communication`
--
ALTER TABLE `communication`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `devices`
--
ALTER TABLE `devices`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT for table `emailTextInfo`
--
ALTER TABLE `emailTextInfo`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `facilities`
--
ALTER TABLE `facilities`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `floors`
--
ALTER TABLE `floors`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sensorOutputTypes`
--
ALTER TABLE `sensorOutputTypes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `sensors`
--
ALTER TABLE `sensors`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=195;

--
-- AUTO_INCREMENT for table `sensorsType`
--
ALTER TABLE `sensorsType`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `userLogs`
--
ALTER TABLE `userLogs`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=384;

--
-- AUTO_INCREMENT for table `zones`
--
ALTER TABLE `zones`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
