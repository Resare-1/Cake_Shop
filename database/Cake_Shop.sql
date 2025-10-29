-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 28, 2025 at 07:15 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cakeshop`
--

-- --------------------------------------------------------

--
-- Table structure for table `ingredient`
--

CREATE TABLE `ingredient` (
  `IngredientID` int(11) NOT NULL,
  `IngredientName` varchar(100) NOT NULL,
  `Unit` varchar(20) NOT NULL,
  `Stock_qty` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ingredient`
--

INSERT INTO `ingredient` (`IngredientID`, `IngredientName`, `Unit`, `Stock_qty`) VALUES
(1, 'Flour', 'g', 50000.00),
(2, 'Sugar', 'g', 30000.00),
(3, 'Egg', 'pcs', 200.00),
(4, 'Butter', 'g', 10000.00),
(5, 'Milk', 'ml', 8000.00);

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `MenuID` int(11) NOT NULL,
  `MenuName` varchar(100) NOT NULL,
  `MenuPrice` decimal(10,2) NOT NULL DEFAULT 0.00,
  `MenuDescription` text DEFAULT NULL,
  `Bake_Time` int(11) DEFAULT NULL,
  `Is_Custom` tinyint(1) NOT NULL DEFAULT 0,
  `Is_Available` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`MenuID`, `MenuName`, `MenuPrice`, `MenuDescription`, `Bake_Time`, `Is_Custom`, `Is_Available`) VALUES
(1, 'Chocolate Cake', 350.00, 'Rich chocolate sponge cake', 45, 0, 1),
(2, 'Vanilla Cupcake', 60.00, 'Vanilla cupcake with buttercream', 20, 0, 1),
(3, 'Custom Birthday Cake', 1200.00, 'Customizable birthday cake', 120, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `menu_ingredient`
--

CREATE TABLE `menu_ingredient` (
  `MenuID` int(11) NOT NULL,
  `IngredientID` int(11) NOT NULL,
  `qty_required` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu_ingredient`
--

INSERT INTO `menu_ingredient` (`MenuID`, `IngredientID`, `qty_required`) VALUES
(1, 1, 200.00),
(1, 2, 100.00),
(1, 3, 4.00),
(1, 4, 50.00),
(1, 5, 100.00),
(2, 1, 50.00),
(2, 2, 30.00),
(2, 3, 1.00),
(2, 4, 20.00),
(3, 1, 500.00),
(3, 2, 300.00),
(3, 3, 10.00),
(3, 4, 200.00),
(3, 5, 500.00);

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `Order_id` int(11) NOT NULL,
  `StaffID` int(11) DEFAULT NULL,
  `Order_Status` enum('Pending','Processing','CheckOrder','Complete','Cancel') NOT NULL DEFAULT 'Pending',
  `Delivery_Cost` decimal(10,2) NOT NULL DEFAULT 0.00,
  `Order_date` datetime NOT NULL,
  `Order_deadline` date DEFAULT NULL,
  `Note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`Order_id`, `StaffID`, `Order_Status`, `Delivery_Cost`, `Order_date`, `Order_deadline`, `Note`) VALUES
(1, 1, 'Cancel', 50.00, '2025-09-25 10:00:00', '2025-09-28', 'Customer requested extra cream'),
(2, 2, 'Processing', 0.00, '2025-09-24 14:30:00', '2025-09-26', 'Pick-up at store'),
(3, 1, 'CheckOrder', 50.00, '2025-09-27 12:16:34', '2025-10-05', 'Customer requested no nuts'),
(6, 1, 'Pending', 50.00, '2025-09-27 15:11:03', '2025-10-05', 'Customer requested no nuts');

-- --------------------------------------------------------

--
-- Table structure for table `order_item`
--

CREATE TABLE `order_item` (
  `Order_Item_Id` int(11) NOT NULL,
  `Order_id` int(11) NOT NULL,
  `MenuID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL DEFAULT 1,
  `Subtotal` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_item`
--

INSERT INTO `order_item` (`Order_Item_Id`, `Order_id`, `MenuID`, `Quantity`, `Subtotal`) VALUES
(1, 1, 1, 1, 350.00),
(2, 1, 2, 6, 360.00),
(3, 2, 3, 1, 1200.00),
(4, 3, 1, 2, 700.00),
(5, 6, 1, 2, 700.00);

-- --------------------------------------------------------

--
-- Table structure for table `production`
--

CREATE TABLE `production` (
  `ProductionID` int(11) NOT NULL,
  `StaffID` int(11) DEFAULT NULL,
  `Order_id` int(11) DEFAULT NULL,
  `Production_Date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `production`
--

INSERT INTO `production` (`ProductionID`, `StaffID`, `Order_id`, `Production_Date`) VALUES
(1, 2, 1, '2025-09-26 09:00:00'),
(2, 2, 2, '2025-09-25 15:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `StaffID` int(11) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Sur_Name` varchar(100) DEFAULT NULL,
  `Role` enum('Manager','Staff','Admin') NOT NULL DEFAULT 'Staff',
  `Staff_Is_Available` tinyint(1) NOT NULL DEFAULT 1,
  `Phone_number` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`StaffID`, `Password`, `Name`, `Sur_Name`, `Role`, `Staff_Is_Available`, `Phone_number`) VALUES
(1, 'pass123', 'Anucha', 'Srisuk', 'Manager', 1, '0812345678'),
(2, 'pass456', 'Napat', 'Chaiya', 'Staff', 1, '0823456789'),
(3, 'pass789', 'Somchai', 'Prasert', 'Admin', 1, '0834567890');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ingredient`
--
ALTER TABLE `ingredient`
  ADD PRIMARY KEY (`IngredientID`);

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`MenuID`);

--
-- Indexes for table `menu_ingredient`
--
ALTER TABLE `menu_ingredient`
  ADD PRIMARY KEY (`MenuID`,`IngredientID`),
  ADD KEY `idx_menuingredient_menu` (`MenuID`),
  ADD KEY `idx_menuingredient_ingredient` (`IngredientID`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`Order_id`),
  ADD KEY `idx_order_staff` (`StaffID`),
  ADD KEY `Order_Status` (`Order_Status`);

--
-- Indexes for table `order_item`
--
ALTER TABLE `order_item`
  ADD PRIMARY KEY (`Order_Item_Id`),
  ADD KEY `idx_orderitem_order` (`Order_id`),
  ADD KEY `idx_orderitem_menu` (`MenuID`);

--
-- Indexes for table `production`
--
ALTER TABLE `production`
  ADD PRIMARY KEY (`ProductionID`),
  ADD KEY `idx_production_staff` (`StaffID`),
  ADD KEY `idx_production_order` (`Order_id`),
  ADD KEY `Production_Date` (`Production_Date`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`StaffID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ingredient`
--
ALTER TABLE `ingredient`
  MODIFY `IngredientID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `MenuID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `Order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `order_item`
--
ALTER TABLE `order_item`
  MODIFY `Order_Item_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `production`
--
ALTER TABLE `production`
  MODIFY `ProductionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `StaffID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `menu_ingredient`
--
ALTER TABLE `menu_ingredient`
  ADD CONSTRAINT `fk_menuingredient_ingredient` FOREIGN KEY (`IngredientID`) REFERENCES `ingredient` (`IngredientID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_menuingredient_menu` FOREIGN KEY (`MenuID`) REFERENCES `menu` (`MenuID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `fk_order_staff` FOREIGN KEY (`StaffID`) REFERENCES `staff` (`StaffID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `order_item`
--
ALTER TABLE `order_item`
  ADD CONSTRAINT `fk_orderitem_menu` FOREIGN KEY (`MenuID`) REFERENCES `menu` (`MenuID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_orderitem_order` FOREIGN KEY (`Order_id`) REFERENCES `order` (`Order_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `production`
--
ALTER TABLE `production`
  ADD CONSTRAINT `fk_production_order` FOREIGN KEY (`Order_id`) REFERENCES `order` (`Order_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_production_staff` FOREIGN KEY (`StaffID`) REFERENCES `staff` (`StaffID`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
