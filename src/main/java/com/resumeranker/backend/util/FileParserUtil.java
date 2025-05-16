package com.resumeranker.backend.util;

import org.apache.james.mime4j.dom.Multipart;
import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public class FileParserUtil {

    private static final Tika tika = new Tika();

    public static String extractText(MultipartFile file) throws TikaException, IOException {
        return tika.parseToString(file.getInputStream());
    }
}

//Apache Tika to convert PDFs, DOCX, etc., into plain text.
//extractText accepts a MultipartFile and returns its text content.