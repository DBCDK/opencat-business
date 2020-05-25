package dk.dbc.opencat;

public class OpenCatException extends Exception {

    public OpenCatException() {

    }

    public OpenCatException(String msg) {
        super(msg);
    }

    public OpenCatException(String msg, Throwable cause) {
        super(msg, cause);
    }

}
