using Microsoft.AspNetCore.HttpsPolicy;
using SimpleIntegrationApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.   
builder.Services.AddHttpClient();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// builder.Services.AddCors(options =>
// {
//     options.AddDefaultPolicy(policy =>
//     {
//         policy.WithOrigins("http://localhost:3000", "https://localhost:3000", "https://hgswscsc8g88koc0gso880o8.mttwhlly.cc")
//               .AllowAnyHeader()
//               .AllowAnyMethod();
//     });
// });

builder.Services.AddHttpClient<NppesApiClient>(client =>
{
    client.BaseAddress = new Uri("https://npiregistry.cms.hhs.gov");
});

var app = builder.Build();

app.UseRouting();
// app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();
app.MapControllers();

app.Run();

