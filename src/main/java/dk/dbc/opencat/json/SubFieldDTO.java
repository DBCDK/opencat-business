package dk.dbc.opencat.json;

public class SubFieldDTO {

    private char name;
    private String value;

    public char getName() {
        return name;
    }

    public void setName(char name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "SubFieldDTO{" +
                "name=" + name +
                ", value='" + value + '\'' +
                '}';
    }
}
