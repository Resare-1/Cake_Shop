module ku.cs.backend {
    requires javafx.controls;
    requires javafx.fxml;


    opens ku.cs.backend to javafx.fxml;
    exports ku.cs.backend;
}