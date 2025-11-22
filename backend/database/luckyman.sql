/*
 Navicat Premium Data Transfer

 Source Server         : luckyman
 Source Server Type    : MySQL
 Source Server Version : 50518
 Source Host           : localhost:3306
 Source Schema         : test

 Target Server Type    : MySQL
 Target Server Version : 50518
 File Encoding         : 65001

 Date: 03/07/2025 15:05:00
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for game_log_infomation
-- ----------------------------
DROP TABLE IF EXISTS `game_log_infomation`;
CREATE TABLE `game_log_infomation`  (
  `room_id` int(11) NOT NULL AUTO_INCREMENT,
  `creator` longtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `bonus` int(11) NULL DEFAULT NULL,
  `fee` int(11) NULL DEFAULT NULL,
  `size` int(11) NULL DEFAULT NULL,
  `winner_id` longtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `winner_bonus` int(11) NULL DEFAULT NULL,
  `finished_at` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `CreateAt` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`room_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = COMPACT;

-- ----------------------------
-- Table structure for person_information
-- ----------------------------
DROP TABLE IF EXISTS `person_information`;
CREATE TABLE `person_information`  (
  `No` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `UserName` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `Password` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `Bounty` int(11) NULL DEFAULT NULL,
  `SignToken` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `Birthdate` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `Gender` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `AllowedByAdmin` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `AvatarURL` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `Email` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`No`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 64 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = COMPACT;

-- ----------------------------
-- Table structure for room_information
-- ----------------------------
DROP TABLE IF EXISTS `room_information`;
CREATE TABLE `room_information`  (
  `room_id` int(11) NOT NULL AUTO_INCREMENT,
  `creator` longtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `bonus` int(11) NULL DEFAULT NULL,
  `fee` int(11) NULL DEFAULT NULL,
  `size` int(11) NULL DEFAULT NULL,
  `members` int(11) NULL DEFAULT NULL,
  `status` int(11) NULL DEFAULT NULL,
  `created_at` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `updated_at` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`room_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 240 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = COMPACT;

-- ----------------------------
-- Table structure for room_log_information
-- ----------------------------
DROP TABLE IF EXISTS `room_log_information`;
CREATE TABLE `room_log_information`  (
  `room_id` int(11) NOT NULL AUTO_INCREMENT,
  `creator` longtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `bonus` int(11) NULL DEFAULT NULL,
  `fee` int(11) NULL DEFAULT NULL,
  `size` int(11) NULL DEFAULT NULL,
  `members` int(11) NULL DEFAULT NULL,
  `status` int(11) NULL DEFAULT NULL,
  `created_at` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `updated_at` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`room_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 234 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = COMPACT;

SET FOREIGN_KEY_CHECKS = 1;
