package dk.dbc.opencat.json;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public class JsonMapper {
    private static JsonMapper instance = new JsonMapper();
    private ObjectMapper mapper;

    public JsonMapper() {
        this.mapper = new ObjectMapper();
    }

    public <T> T readValue(String content, Class<T> clazz) throws IOException {
        return mapper.readValue(content, clazz);
    }

    public <T> T readValue(InputStream src, Class<T> clazz) throws IOException {
        return mapper.readValue(src, clazz);
    }

    public <T> T readValue(File src, Class<T> clazz) throws IOException {
        return mapper.readValue(src, clazz);
    }

    public <T> List<T> readArrayValue(String content, Class<T> clazz) throws IOException {
        return mapper.readValue(content, TypeFactory.defaultInstance().constructCollectionType(List.class, clazz));
    }

    public <T> List<T> readArrayValue(File src, Class<T> clazz) throws IOException {
        return mapper.readValue(src, TypeFactory.defaultInstance().constructCollectionType(List.class, clazz));
    }

    public String writeValue(Object value) throws IOException {
        return mapper.writeValueAsString(value);
    }

    public String writePrettyValue(Object value) throws IOException {
        return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(value);
    }

    public static <T> T decode(String content, Class<T> clazz) throws IOException {
        return instance.readValue(content, clazz);
    }

    public static <T> T decode(InputStream src, Class<T> clazz) throws IOException {
        return instance.readValue(src, clazz);
    }

    public static <T> T decode(File src, Class<T> clazz) throws IOException {
        return instance.readValue(src, clazz);
    }

    public static <T> List<T> decodeArray(String content, Class<T> clazz) throws IOException {
        return instance.readArrayValue(content, clazz);
    }

    public static <T> List<T> decodeArray(File src, Class<T> clazz) throws IOException {
        return instance.readArrayValue(src, clazz);
    }

    public static String encode(Object value) throws IOException {
        return instance.writeValue(value);
    }

    public static String encodePretty(Object value) throws IOException {
        return instance.writePrettyValue(value);
    }

    public static WrapperDataField wrapDataFieldDTO(DataFieldDTO dataFieldDTO) {
        final WrapperDataField dataField = new WrapperDataField(dataFieldDTO.getName(), String.join("", dataFieldDTO.getIndicator()));
        for (SubFieldDTO subFieldDTO : dataFieldDTO.getSubfields()) {
            dataField.getSubfields().add(new WrapperSubField(String.valueOf(subFieldDTO.getName()), subFieldDTO.getValue()));
        }
        return dataField;
    }
}
